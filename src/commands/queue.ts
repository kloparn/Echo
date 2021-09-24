import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  if (!globalData.isConnectedToVoice) return globalData.channel.send("im not connected");
  if (!globalData.queue) return globalData.channel.send("Nothing in the queue!");
  const queueArray = globalData.queue.map((item, index) => `${index + 1} | ${item.includes("https") ? `<${item}>` : `${item}`}`);
  return globalData.channel.send(`current queue: \n${queueArray.join("\n")}`)
};
