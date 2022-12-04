import { User } from "discord.js";
import search from "youtube-search";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { playSound } from "../helpers/playSound";
import sendMessage from "../helpers/sendMessage";
import { multipleSearch } from "../helpers/youtubeSearch";
import { VideoObject } from "../interfaces";
import QueueObject from "../interfaces/queue-interface";

const globalData = ClientMemory.getInstance();

const execute = async (args, msg) => {
  const searchTerm = args.join(" ");
  await clientHandler.setupClient(msg);
  const allVideos = await multipleSearch(searchTerm, 5);
  if (!allVideos.length) return;
  const message = await sendMessage(
    allVideos.map((youtubeVideo: any, index) => `${index + 1} | ${youtubeVideo.title}`).join("\n")
  );
  const messages = [];
  messages.push(await message.react("1️⃣"));
  messages.push(await message.react("2️⃣"));
  messages.push(await message.react("3️⃣"));
  messages.push(await message.react("4️⃣"));
  messages.push(await message.react("5️⃣"));

  globalData.channel.client.on("messageReactionAdd", async (msg, user: User) => {
    const reactedMsg = messages.find((_msg) => _msg === msg);
    if (!reactedMsg) return;
    const index = messages.findIndex((_msg) => _msg === reactedMsg) + 1;
    const pickedVideo: VideoObject = allVideos[index - 1];

    const queueObject: QueueObject = {
      type: "video",
      link: new URL(pickedVideo.link),
      title: pickedVideo.title,
      userId: user.id,
    };

    if (!globalData.dispatcher) {
      playSound(queueObject);
    } else {
      sendMessage(`${pickedVideo.title} added to the queue, it's in position ${globalData.queue.length + 1}`);
      clientHandler.addToQueue(queueObject);
    }

    messages.length = 0;
  });
};

export default {
  execute,
  alias: [],
};
