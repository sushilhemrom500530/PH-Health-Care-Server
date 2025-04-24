import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus } from "@prisma/client";

const getAllFromDB = async (user: TTokenUser, payload: any) => {

}
const getMyAppointment = async (user: TTokenUser, filters: any, options: TPaginationOptions) => {
    const { limit, page, skip } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];


    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        })
    }
    else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: user.role === UserRole.PATIENT
            ? { doctor: true, schedule: true }
            : {
                patient:
                {
                    include:
                    {
                        medicalReport: true,
                        patientHealthData: true
                    }
                },
                schedule: true
            }
    });
    const total = await prisma.appointment.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}

const insertIntoDB = async (user: TTokenUser, payload: any) => {
    // console.log('appointment created successfully', { payload });
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    // console.log({ patientData })
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    })

    const doctorScheduleData = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuidv4();
    // console.log("uuid", videoCallingId)

    const createData = {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId
    };

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await prisma.appointment.create({
            data: createData,
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        })

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        })

        // PH-HealthCare-datatime
        const today = new Date();

        const transactionId = "PH-HealthCare-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();

        await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        return appointmentData;
    })
    return result;
}

const changeAppointmentStatus =async (appointmentId:string,payload:AppointmentStatus,user:TTokenUser)=>{
    const {status} =payload;
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });

    if (user?.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(status.BAD_REQUEST, "This is not your appointment!")
        }
    }

    const result = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });

    return result;
}

const cancelUnpaidAppointments = async()=>{
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)

    const unPaidAppointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo
            },
            paymentStatus: PaymentStatus.UNPAID
        },
    });
    // console.log(unPaidAppointments)
    const appointmentIdsToCancel = unPaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel
                }
            }
        });

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIdsToCancel
                }
            }
        });

        for (const upPaidAppointment of unPaidAppointments) {
            await tx.doctorSchedules.updateMany({
                where: {
                    doctorId: upPaidAppointment.doctorId,
                    scheduleId: upPaidAppointment.scheduleId
                },
                data: {
                    isBooked: false
                }
            })
        }
    })

    console.log("updated")
}

export const appointmentService = {
    getAllFromDB,
    getMyAppointment,
    insertIntoDB,
    changeAppointmentStatus,
    cancelUnpaidAppointments
}