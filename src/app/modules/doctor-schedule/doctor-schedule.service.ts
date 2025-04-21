import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces";


const getAllFromDB = async () => {
    const result = await prisma.doctorSchedules.findMany();
    return result;
}

const insertIntoDB = async (user: TTokenUser, payload: { scheduleIds: string[] }) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))
    // console.log({ doctorScheduleData })
    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });
    return result;
}

export const doctorScheduleService = {
    getAllFromDB,
    insertIntoDB
}