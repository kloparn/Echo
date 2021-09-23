import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  if (!globalData.isConnectedToVoice) return globalData.channel.send("im not connected");
  const queueArray = globalData.queue.map((item, index) => `${index + 1} | ${item}`);
  return globalData.channel.send(`current queue: \n${queueArray.join("\n")}`)
};
