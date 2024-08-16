"use strict";
// queues/bidQueue.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = exports.bidQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const bidService_1 = require("../services/bidService");
const BidServiceInterface_1 = require("../../application/services/BidServiceInterface");
const bidRepositoryMongoDb_1 = require("../database/mongodb/repositories/bidRepositoryMongoDb");
const bidRepository_1 = require("../../application/repositories/bidRepository");
const bidHistoryRepository_1 = require("../../application/repositories/bidHistoryRepository");
const bidHistoryRepositoryMongoDb_1 = require("../database/mongodb/repositories/bidHistoryRepositoryMongoDb");
const notificationRepository_1 = require("../../application/repositories/notificationRepository");
const notificationRepositoryMongoDB_1 = require("../database/mongodb/repositories/notificationRepositoryMongoDB");
const notificationServiceInterface_ts_1 = require("../../application/services/notificationServiceInterface.ts");
const notificationService_1 = require("../services/notificationService");
const bidService = (0, BidServiceInterface_1.bidServiceInterface)((0, bidService_1.bidService)());
const notificationService = (0, notificationServiceInterface_ts_1.notificationServiceInterface)((0, notificationService_1.notificationService)());
const bidRepository = (0, bidRepository_1.bidDbRepository)((0, bidRepositoryMongoDb_1.bidRepositoryMongoDb)());
const notificationRepo = (0, notificationRepository_1.notificationRepository)((0, notificationRepositoryMongoDB_1.notificationRepositoryMongoDB)());
const bidHistoryRepo = (0, bidHistoryRepository_1.bidHistoryRepository)((0, bidHistoryRepositoryMongoDb_1.bidHistoryRepositoryMongoDb)());
const connection = new ioredis_1.default({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
const bidQueue = new bullmq_1.Queue("bidQueue", { connection });
exports.bidQueue = bidQueue;
const worker = new bullmq_1.Worker("bidQueue", async (job) => {
    const { bidId, productId } = job.data;
    await bidService.processBidClosure(bidRepository, bidHistoryRepo, notificationRepo, bidId, productId, notificationService);
}, { connection });
exports.worker = worker;
worker.on("completed", (job) => {
    console.log(`Job with id ${job.id} has been completed`);
});
worker.on("failed", (job, err) => {
    if (job)
        console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});
