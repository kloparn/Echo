import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.voiceStatus
    ? globalData.dispatcher.resume()
    : globalData.channel.send("im not connected");
};
