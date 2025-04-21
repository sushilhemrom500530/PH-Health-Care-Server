import prisma from "../../../shared/prisma";


const getAllFromDB = async () => {
    const result = await prisma.doctorSchedules.findMany();
    return result;
}

const insertIntoDB = async (payload: any) => {

}

export const doctorScheduleService = {
    getAllFromDB,
    insertIntoDB
}