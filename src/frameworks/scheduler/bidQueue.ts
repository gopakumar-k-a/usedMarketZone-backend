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

const bidService: ReturnType<BidServiceInterface> = bidServiceInterface(
  bidServiceImpl()
);
const bidRepository: ReturnType<BidInterface> = bidDbRepository(
  bidRepositoryMongoDb()
);

const connection = new IORedis();

const bidQueue = new Queue("bidQueue", { connection });

// Worker to process bid closure jobs
const worker = new Worker(
  "bidQueue",
  async (job) => {
    const { bidId } = job.data;
    await bidService.processBidClosure(bidRepository, bidId);
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
