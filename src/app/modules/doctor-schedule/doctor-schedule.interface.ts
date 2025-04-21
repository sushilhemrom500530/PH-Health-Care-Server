
export type TDoctorSchedule = {
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string
}


export type TDoctorScheduleFilter = {
    startDate?: string | undefined,
    endDate?: string | undefined,
    isBooked?: boolean | false
}