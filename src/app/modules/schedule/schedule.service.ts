import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { TSchedule, TScheduleFilter } from "./schedule.interface";
import calculatePagination from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TTokenUser } from "../../interfaces";


const getAllFromDB = async (
    filters: TScheduleFilter,
    options: TPaginationOptions,
    user: TTokenUser
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    // console.log({ user })
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        })
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

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedule = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    })
    const doctorScheduleIds = doctorSchedule.map(scheduleId => scheduleId.scheduleId)
    console.log({ doctorScheduleIds })

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
    });
    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
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


const insertIntoDB = async (payload: TSchedule): Promise<Schedule[]> => {
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

const getSingleFromDB = async (id: string) => {
    const result = await prisma.schedule.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result;
}

export const scheduleService = {
    getAllFromDB,
    insertIntoDB,
    getSingleFromDB
}