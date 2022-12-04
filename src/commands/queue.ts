import ClientMemory from "../classes/ClientMemory";
import sendMessage from "../helpers/sendMessage";
import QueueObject from "../interfaces/queue-interface";
const globalData = ClientMemory.getInstance();

const execute = () => {
  if (!globalData.isConnectedToVoice) return sendMessage("im not connected");
  if (!globalData.queue || !globalData.queue.length) return sendMessage("Nothing in the queue!");
  const queueArray = globalData.queue.map((item: QueueObject, index) => {
    return `${index + 1} | <${item.link.toString()}> -- ${item.title}`;
  });
  return sendMessage(`current queue: \n${queueArray.join("\n")}`);
};

export default {
  execute,
  alias: ["q", "que"],
};
