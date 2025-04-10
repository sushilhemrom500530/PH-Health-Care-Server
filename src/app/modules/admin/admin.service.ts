import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleField } from "./admin.constant";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";



const getAllFromDB = async (params: any, options: any) => {
    const { searchTerm, ...filterData } = params;
    const { page, limit, skip, } = calculatePagination(options);
    const andConditions: Prisma.AdminWhereInput[] = [];


    // [
    //     {
    //         name: {
    //             contains: params.searchTerm,
    //             mode: "insensitive"
    //         }
    //     },
    //     {
    //         email: {
    //             contains: params.searchTerm,
    //             mode: "insensitive"
    //         }
    //     }
    // ]



    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleField.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // specific field name for filter or query in DB 
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }


    // console.dir(andConditions, { depth: "inifinity" })

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.admin.count({
        where: whereConditions
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}


const getSingleDataById = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    })
    return result;
}


const updateAdmin = async (id: string, updateData: Partial<Admin>) => {
    // console.log("Admin updated successfully", id, updateData)
    await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.admin.update({
        where: {
            id
        },
        data: updateData
    })
    return result;
}

const deletedAdmin = async (id: string) => {

    await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {
        const deletedAdminData = await transactionClient.admin.delete({
            where: {
                id
            }
        });
        await transactionClient.user.delete({
            where: {
                email: deletedAdminData.email
            }
        })
        return deletedAdminData;
    })
    return result;
}

const softDeletedAdmin = async (id: string) => {

    await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {
        const deletedAdminData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: deletedAdminData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })
        return deletedAdminData;
    })
    return result;
}
export const adminService = {
    getAllFromDB,
    getSingleDataById,
    updateAdmin,
    deletedAdmin,
    softDeletedAdmin
}