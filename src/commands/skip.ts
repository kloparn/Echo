import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

const execute = (args: any) => {
  if (args.length === 0) {
    globalData.isConnectedToVoice
      ? globalData.dispatcher.end()
      : globalData.channel.send("im not connected");
  } else {
    if(isNaN(args[0])) return globalData.channel.send("Sorry you need to send only a number");
    const queueNumber = parseInt(args[0]); //make error handler if string instead of number
    if (globalData.queue.length < queueNumber) {
      return globalData.channel.send("The number does not exist in the queue")
    } else {
      const queueItem = globalData.queue.splice(queueNumber - 1, 1);
      return globalData.channel.send(`Removed ${queueItem} from the queue`);
    }
  }
};

export default {
  execute,
  alias: ["s"]
}
