import { string } from "zod"

export type TSchedule = {
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string
}

export type TScheduleFilter = {
    startDate?: string | undefined,
    endDate?: string | undefined
}