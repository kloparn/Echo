import { Message } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import getVideoInformation from "../helpers/getVideoInformation";
import { playSound } from "../helpers/playSound";
import sendMessage from "../helpers/sendMessage";
import { QueueObject, VideoObject } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (args: [], msg: Message, userId: string) => {
  const searchTerm = args.join(" ");
  if (!searchTerm.length) return;

  const youtubeVideo: VideoObject = await getVideoInformation(searchTerm);

  if (!youtubeVideo) return;

  const queueObject: QueueObject = {
    type: "video",
    link: new URL(youtubeVideo.link),
    title: youtubeVideo.title,
    userId: userId,
  };

  if (globalData.isConnectedToVoice && globalData.dispatcher) {
    if (!youtubeVideo) return;
    else sendMessage(`${queueObject.title} added to the queue, it's in position ${globalData.queue.length + 1}`);

    return clientHandler.addToQueue(queueObject);
  }
  await clientHandler.setupClient(msg);
  await playSound(queueObject);
};

exports.default = {
  execute,
  alias: ["p"],
};
