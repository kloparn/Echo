import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { playSound } from "../helpers/playSound";
import { multipleSearch } from "../helpers/youtubeSearch";
const globalData = ClientMemory.getInstance();

const execute = async (args, msg) => {
  const searchTerm = args.join(" ")
  if(!searchTerm.length) return;
  if (globalData.isConnectedToVoice && globalData.dispatcher){
    const youtubeVideo = await multipleSearch(searchTerm, 1);
    if(!youtubeVideo[0])
      globalData.channel.send(`${searchTerm} added to the queue, it's in position ${globalData.queue.length + 1}`)
    else globalData.channel.send(`${youtubeVideo[0].title} added to the queue, it's in position ${globalData.queue.length + 1}`)
    return clientHandler.addToQueue(youtubeVideo[0] && youtubeVideo[0].title || searchTerm);
  } 
  await clientHandler.setupClient(msg);
  await playSound(searchTerm);
}

exports.default = {
  execute,
  alias: ["p"]
};