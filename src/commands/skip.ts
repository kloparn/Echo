import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = (args) => {
  if (args.length === 0) {
    globalData.isConnectedToVoice
      ? globalData.dispatcher.end()
      : globalData.channel.send("im not connected");
  } else {
    const queueNumber = parseInt(args[0]); //make error handler if string instead of number
    if (globalData.queue.length - 1 < queueNumber) {
      return globalData.channel.send("The number does not exist in the queue")
    } else {
      const queueItem = globalData.queue.splice(queueNumber, 1);
      return globalData.channel.send(`Removed ${queueItem} from the queue`);
    }
  }
};
