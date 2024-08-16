"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const scheduleService = () => {
    const scheduleJob = (date, jobFunction) => {
        node_schedule_1.default.scheduleJob(date, jobFunction);
    };
    return { scheduleJob };
};
exports.scheduleService = scheduleService;
