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
import {
  BidHistoryInterface,
  bidHistoryRepository,
} from "../../application/repositories/bidHistoryRepository";
import { bidHistoryRepositoryMongoDb } from "../database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import {
  NotificationInterface,
  notificationRepository,
} from "../../application/repositories/notificationRepository";
import { notificationRepositoryMongoDB } from "../database/mongodb/repositories/notificationRepositoryMongoDB";
import { notificationServiceInterface, NotificationServiceInterface } from "../../application/services/notificationServiceInterface.ts";
import { notificationService  as notificationServiceImpl } from "../services/notificationService";

const bidService: ReturnType<BidServiceInterface> = bidServiceInterface(
  bidServiceImpl()
);
const notificationService:ReturnType<NotificationServiceInterface>=notificationServiceInterface(notificationServiceImpl())
const bidRepository: ReturnType<BidInterface> = bidDbRepository(
  bidRepositoryMongoDb()
);

const notificationRepo: ReturnType<NotificationInterface> =
  notificationRepository(notificationRepositoryMongoDB());
const bidHistoryRepo: ReturnType<BidHistoryInterface> = bidHistoryRepository(
  bidHistoryRepositoryMongoDb()
);



const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const bidQueue = new Queue("bidQueue", { connection });

const worker = new Worker(
  "bidQueue",
  async (job) => {
    const { bidId,productId } = job.data;
    await bidService.processBidClosure(
      bidRepository,
      bidHistoryRepo,
      notificationRepo,
      bidId,
      productId,
      notificationService
    );
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
