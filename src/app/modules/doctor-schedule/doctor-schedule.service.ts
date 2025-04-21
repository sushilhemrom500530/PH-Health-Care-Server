import { Prisma } from "@prisma/client";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TDoctorScheduleFilter } from "./doctor-schedule.interface";

const getMySchedule = async (
    filters: TDoctorScheduleFilter,
    options: TPaginationOptions,
    user: TTokenUser
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    console.log({ filters })
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    }

    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }

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

    const whereConditions: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};



    const result = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {},
    });
    const total = await prisma.doctorSchedules.count({
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
const deleteFromDB = async () => {
    console.log("my schedule delete successfuly")
}

export const doctorScheduleService = {
    getMySchedule,
    insertIntoDB,
    deleteFromDB
}