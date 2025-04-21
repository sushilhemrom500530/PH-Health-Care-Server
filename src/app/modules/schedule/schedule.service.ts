import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";


const getAllFromDB = async () => {
    console.log("Schedule Service")
}

const insertIntoDB = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate)
    // console.log("Schedule Service", lastDate)
    const interverlTime = 30;

    const schedules = [];

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        )
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(lastDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        )
        console.log(startDateTime, endDateTime);


        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, interverlTime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules
}

export const scheduleService = {
    getAllFromDB,
    insertIntoDB
}