import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
    const { searchTerm, ...filterData } = params;
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

    const adminSearchAbleField = ['name', 'email']

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
        where: whereConditions
    });
    return result;
}

export const adminService = {
    getAllFromDB
}