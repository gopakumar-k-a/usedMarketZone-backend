import { ScheduleService } from "../../frameworks/scheduler/scheduleService";

export const scheduleServiceInterface=(scheduleService:ReturnType<ScheduleService>)=>{

    const scheduleJob = (date: Date, jobFunction: () => void): void =>scheduleService.scheduleJob(date,jobFunction)

    return {scheduleJob}
}

export type ScheduleServiceInterface=typeof scheduleServiceInterface