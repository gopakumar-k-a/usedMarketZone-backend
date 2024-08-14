import schedule from "node-schedule";

export const scheduleService = () => {
  const scheduleJob = (date: Date, jobFunction: () => void): void => {
    schedule.scheduleJob(date, jobFunction);
  };

  return {scheduleJob};
};

export type ScheduleService = typeof scheduleService;
