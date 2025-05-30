import prisma from "../../../shared/prisma"
import { Patient, Prisma, UserStatus } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { patientSearchableFields } from "./patient.constant";
import calculatePagination from "../../../helpers/paginationHelper";
import { TPatientFilterRequest, TPatientUpdate } from "./patient.interface";

const getAllFromDB = async (
    filters: TPatientFilterRequest,
    options: TPaginationOptions,
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

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
    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            medicalReport: true,
            patientHealthData: true,
        }
    });
    const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            medicalReport: true,
            patientHealthData: true,
        },
    });
    return result;
};

const updateIntoDB = async (id: string, payload: Partial<TPatientUpdate>): Promise<Patient | null> => {
    const { patientHealthData, medicalReport, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    // console.log({ patientInfo })
    await prisma.$transaction(async (transactionClient) => {
        //update patient data
        await transactionClient.patient.update({
            where: {
                id
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        });
        // console.log({ update })
        // create or update patient health data
        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: patientInfo.id }
            });
        };

        if (medicalReport) {
            await transactionClient.medicalReport.create({
                data: { ...medicalReport, patientId: patientInfo.id }
            })
        }
    })


    const responseData = await prisma.patient.findUnique({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    })
    // console.log({ responseData })
    return responseData;

};


const deleteFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.$transaction(async (tx) => {
        // delete medical report
        const md = await tx.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        });
        console.log({ md })
        // delete patient health data
        const pd = await tx.patientHealthData.delete({
            where: {
                patientId: id
            }
        });
        console.log({ pd })
        const deletedPatient = await tx.patient.delete({
            where: {
                id
            }
        });
        console.log({ deletedPatient })
        const du = await tx.user.delete({
            where: {
                email: deletedPatient.email
            }
        });
        console.log({ du })

        return deletedPatient;
    });
    console.log({ result })

    return result;
};

const softDelete = async (id: string): Promise<Patient | null> => {
    return await prisma.$transaction(async transactionClient => {
        const deletedPatient = await transactionClient.patient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deletedPatient.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deletedPatient;
    });
};


export const patientService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete
}