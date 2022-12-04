import { Message, TextChannel } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { QueueObject } from "../interfaces";

const globalData = ClientMemory.getInstance();

const setupClient = async (userMessage: Message) => {
  globalData.channel = userMessage.channel as TextChannel;
  globalData.isConnectedToVoice = true;
  globalData.voiceChannel = userMessage.member.voice.channel;
  globalData.connection = await userMessage.member.voice.channel.join();
};

const setDispatcher = (dispatcher: any) => (globalData.dispatcher = dispatcher);

const addToQueue = (queueItem: QueueObject) => globalData.queue.push(queueItem);

const getFromQueue = (): QueueObject => globalData.queue.shift();

const updatePlaying = () => (globalData.paused = !globalData.paused);

const destroyClient = () => {
  globalData.voiceChannel.leave();
  ClientMemory.wipeInstance();
};

export default {
  setupClient: setupClient,
  destroyClient: destroyClient,
  setDispatcher: setDispatcher,
  addToQueue: addToQueue,
  getFromQueue: getFromQueue,
  updatePlaying: updatePlaying,
};
