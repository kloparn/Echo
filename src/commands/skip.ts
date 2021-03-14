import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.voiceStatus
    ? globalData.dispatcher.end()
    : globalData.channel.send("im not connected");
};
