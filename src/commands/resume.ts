import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

const execute = () => {
  globalData.isConnectedToVoice
    ? globalData.dispatcher.resume()
    : globalData.channel.send("im not connected");
};

export default {
  execute,
  alias: ["r", "res"]
}
