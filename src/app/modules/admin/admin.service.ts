import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {

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


    console.dir(andConditions, { depth: "inifinity" })

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }

    const result = await prisma.admin.findMany({
        where: whereConditions
    });
    return result;
}

export const adminService = {
    getAllFromDB
}