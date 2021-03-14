import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { playSound } from "../helpers/playSound";

const globalData = ClientMemory.getInstance();

export = async (args, msg) => {
  const searchTerm = args.join(" ")
  if (globalData.isConnectedToVoice){
    globalData.channel.send(`${searchTerm} added to the queue, it's in position ${globalData.queue.length + 1}`)
    return clientHandler.addToQueue(searchTerm);
  } 
  await clientHandler.setupClient(msg);
  await playSound(searchTerm);
};
