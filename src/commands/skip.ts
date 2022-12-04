import ClientMemory from "../classes/ClientMemory";
import sendMessage from "../helpers/sendMessage";
const globalData = ClientMemory.getInstance();

const execute = (args: any) => {
  if (args.length === 0) {
    globalData.isConnectedToVoice ? globalData.dispatcher.end() : sendMessage("im not connected");
  } else {
    if (isNaN(args[0])) return sendMessage("Sorry you need to send only a number");
    const queueNumber = parseInt(args[0]);
    if (globalData.queue.length < queueNumber) {
      return sendMessage("The number does not exist in the queue");
    } else {
      const queueItem = globalData.queue.splice(queueNumber - 1, 1);
      return sendMessage(`Removed ${queueItem} from the queue`);
    }
  }
};

export default {
  execute,
  alias: ["s"],
};
