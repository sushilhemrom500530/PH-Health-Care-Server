import { Prisma } from "@prisma/client";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TDoctorScheduleFilter } from "./doctor-schedule.interface";
import apiError from "../../error/apiError";
import status from "http-status";

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
const deleteFromDB = async (user: TTokenUser, scheduleId: string) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    // console.log({ doctorData })

    const isBookingSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true
        }
    });
    // console.log({ isBookingSchedule })
    if (isBookingSchedule) {
        console.log("worked but doesn't show-------")
        throw new apiError(status.BAD_REQUEST, "you can not delete this schedule because of the schedule already booked!")
    }

    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    });
    return result;

}

export const doctorScheduleService = {
    getMySchedule,
    insertIntoDB,
    deleteFromDB
}