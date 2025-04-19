import prisma from "../../../shared/prisma"
import calculatePagination from "../../../helpers/paginationHelper";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TPatientFilterRequest, TPatientUpdate } from "./patient.interface";
import { patientSearchableFields } from "./patient.constant";

const getAllFromDB = async (
    filters: TPatientFilterRequest,
    options: TPaginationOptions,
) => {
    const { page, limit, skip, } = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (specialties && specialties.length > 0) {
        // Corrected specialties condition
        andConditions.push({
            doctorSpecialities: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        // include: {
        //     doctorSpecialities: {
        //         include: {
        //             specialities: true
        //         }
        //     }
        // },
    });

    const total = await prisma.doctor.count({
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
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {

    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        }
    })
    return result;
}
const updateDoctor = async (id: string, payload: TPatientUpdate) => {
    const { specialities, ...doctorData } = payload;

    const doctorInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transectionClient) => {
        await transectionClient.patient.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialities && specialities.length > 0) {
            // delete specialities 
            const deleteSpecialitiesIds = specialities.filter((speciality: any) => speciality.isDeleted);

            for (const speciality of deleteSpecialitiesIds) {
                await transectionClient.doctorSpecialities.deleteMany({
                    where: {
                        specialitiesId: speciality.specialitiesId,
                        doctorId: doctorInfo.id
                    }
                })
            }
            // create specialities 
            const createSpecialitiesIds = specialities.filter((speciality: any) => !speciality.isDeleted);

            for (const speciality of createSpecialitiesIds) {
                await transectionClient.doctorSpecialities.create({
                    data: {
                        specialitiesId: speciality.specialitiesId,
                        doctorId: doctorInfo.id
                    }
                })
            }
        }
    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        }
    })

    return result;
}

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};


export const patientService = {
    getAllFromDB,
    getByIdFromDB,
    updateDoctor,
    deleteFromDB,
    softDelete
}