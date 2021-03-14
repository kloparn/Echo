import { Message, StreamDispatcher, TextChannel } from "discord.js";
import ClientMemory from "../classes/ClientMemory";

const globalData = ClientMemory.getInstance();

const setupClient = async (userMessage: Message) => {
  globalData.channel = userMessage.channel as TextChannel;
  globalData.voiceStatus = true;
  globalData.voiceChannel = userMessage.member.voice.channel;
  globalData.connection = await userMessage.member.voice.channel.join();
  //console.log(globalData);
};

const setDispatcher = (dispatcher: StreamDispatcher) =>
  (globalData.dispatcher = dispatcher);

const addToQueue = (url: string) => globalData.queue.push(url);

const getFromQueue = (): string => globalData.queue.shift();

const destroyClient = () => {
  globalData.voiceChannel.leave();
  ClientMemory.wipeInstance();
  //console.log(globalData);
};

export default {
  setupClient: setupClient,
  destroyClient: destroyClient,
  setDispatcher: setDispatcher,
  addToQueue: addToQueue,
  getFromQueue: getFromQueue,
};
