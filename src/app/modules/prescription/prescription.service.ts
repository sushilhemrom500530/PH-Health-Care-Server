import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";



const getAllFromDB = async (user: TTokenUser, payload: any) => {

}


const insertIntoDB = async (user: TTokenUser,payload:any) => {

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });
   
    if (!(user?.email === appointmentData.doctor.email)) {
        // throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!")
        return {
            message:"This is not your appointment!"
        }
    };

    const prescriptionData = {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        instructions: payload.instructions as string,
        followUpDate: payload.followUpDate || null || undefined
    }

    const result = await prisma.prescription.create({
        data:prescriptionData,
        include: {
            patient: true
        }
    });
    return result;
}


const patientPrescription = async(user:TTokenUser,options:TPaginationOptions)=>{
    const { limit, page, skip } = calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user?.email
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user?.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
}


export const prescriptionService = {
    getAllFromDB,
    insertIntoDB,
    patientPrescription,

}