// queues/bidQueue.ts

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { bidService as bidServiceImpl } from "../services/bidService";
import { bidServiceInterface } from "../../application/services/BidServiceInterface";
import { bidRepositoryMongoDb } from "../database/mongodb/repositories/bidRepositoryMongoDb";
import {
  bidDbRepository,
  BidInterface,
} from "../../application/repositories/bidRepository";
import { BidServiceInterface } from "../../application/services/BidServiceInterface";
import { BidHistoryInterface, bidHistoryRepository } from "../../application/repositories/bidHistoryRepository";
import { bidHistoryRepositoryMongoDb } from "../database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { NotificationInterface, notificationRepository } from "../../application/repositories/notificationRepository";
import { notificationRepositoryMongoDB } from "../database/mongodb/repositories/notificationRepositoryMongoDB";

const bidService: ReturnType<BidServiceInterface> = bidServiceInterface(
  bidServiceImpl()
);
const bidRepository: ReturnType<BidInterface> = bidDbRepository(
  bidRepositoryMongoDb()
);

const notificationRepo:ReturnType<NotificationInterface>=notificationRepository(notificationRepositoryMongoDB())
const bidHistoryRepo:ReturnType<BidHistoryInterface>=bidHistoryRepository(bidHistoryRepositoryMongoDb())

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,  // Ensure this is set to null
  enableReadyCheck: false      // Add this if you encounter ready check issues
});

const bidQueue = new Queue("bidQueue", { connection });

// Worker to process bid closure jobs
const worker = new Worker(
  "bidQueue",
  async (job) => {
    const { bidId } = job.data;
    await bidService.processBidClosure(bidRepository,bidHistoryRepo,notificationRepo, bidId);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
  if (job)
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export { bidQueue, worker };
