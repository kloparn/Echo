import { Message, TextChannel } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { QueueObject } from "../interfaces";

const globalData = ClientMemory.getInstance();

const addToQueue = (queueItem: QueueObject) => globalData.queue.push(queueItem);

const getFromQueue = (): QueueObject => globalData.queue.shift();

const destroyClient = () => {
  ClientMemory.wipeInstance();
};

export default {
  destroyClient: destroyClient,
  addToQueue: addToQueue,
  getFromQueue: getFromQueue,
};
