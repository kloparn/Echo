import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.isConnectedToVoice
    ? globalData.dispatcher.resume()
    : globalData.channel.send("im not connected");
};
