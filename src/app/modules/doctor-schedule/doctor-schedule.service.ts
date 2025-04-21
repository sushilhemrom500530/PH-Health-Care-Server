import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces";


const getAllFromDB = async () => {
    const result = await prisma.doctorSchedules.findMany();
    return result;
}

const insertIntoDB = async (user: TTokenUser, payload: { scheduleIds: string[] }) => {
    const findUser = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    console.log(findUser, payload)
}

export const doctorScheduleService = {
    getAllFromDB,
    insertIntoDB
}