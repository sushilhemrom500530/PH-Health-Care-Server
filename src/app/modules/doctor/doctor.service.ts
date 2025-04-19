import prisma from "../../../shared/prisma"
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (
    filters: IDoctorFilterRequest,
    options: IPaginationOptions,
) => {
    const { page, limit, skip, } = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
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

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        },
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

const updateDoctor = async (id: string, payload: any) => {
    const { specialities, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transectionClient) => {
        await transectionClient.doctor.update({
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

export const doctorService = {
    getAllFromDB,
    updateDoctor,
}