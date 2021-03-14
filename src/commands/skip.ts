import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.isConnectedToVoice
    ? globalData.dispatcher.end()
    : globalData.channel.send("im not connected");
};
