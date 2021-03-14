import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { playSound } from "../helpers/playSound";

const globalData = ClientMemory.getInstance();

export = async (args, msg) => {
  if (globalData.voiceStatus){
    globalData.channel.send(`${args.join(" ")} added to the queue, it's in position ${globalData.queue.length + 1}`)
    return clientHandler.addToQueue(args.join(" "));
  } 
  await clientHandler.setupClient(msg);
  await playSound(args.join(" "));
};
