import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  if (!globalData.isConnectedToVoice) return globalData.channel.send("im not connected");
  return globalData.channel.send(`current queue: ${globalData.queue.join("\n")}`)
};
