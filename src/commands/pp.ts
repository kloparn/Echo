import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { playSound } from "../helpers/playSound";
import { multipleSearch } from "../helpers/youtubeSearch";

const globalData = ClientMemory.getInstance();

export = async (args, msg) => {
  const searchTerm = args.join(" ")
  await clientHandler.setupClient(msg);
  const allVideos = await multipleSearch(searchTerm, 5);
  if (!allVideos.length) return
  const message = await globalData.channel.send(allVideos.map((youtubeVideo: any, index) => `${index + 1} | ${youtubeVideo.title}`).join("\n"));
  const messages = [];
  messages.push(await message.react("1️⃣"));
  messages.push(await message.react("2️⃣"));
  messages.push(await message.react("3️⃣"));
  messages.push(await message.react("4️⃣"));
  messages.push(await message.react("5️⃣"));

  globalData.channel.client.on("messageReactionAdd", (msg) => {
    const reactedMsg = messages.find((_msg) => _msg === msg);
    if(!reactedMsg)
      return;
    const index = messages.findIndex((_msg) => _msg === reactedMsg) + 1;
    if(!globalData.dispatcher) {
      playSound(allVideos[index - 1].link);
    } else {
      globalData.channel.send(`${allVideos[index - 1].title} added to the queue, it's in position ${globalData.queue.length + 1}`)
      clientHandler.addToQueue(allVideos[index - 1].link);
    }
    
    messages.length = 0;
  })
};
