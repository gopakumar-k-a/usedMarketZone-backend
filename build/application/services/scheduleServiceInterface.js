"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleServiceInterface = void 0;
const scheduleServiceInterface = (scheduleService) => {
    const scheduleJob = (date, jobFunction) => scheduleService.scheduleJob(date, jobFunction);
    return { scheduleJob };
};
exports.scheduleServiceInterface = scheduleServiceInterface;
