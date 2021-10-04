import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

const execute = () => {
  globalData.isConnectedToVoice
  ? globalData.dispatcher.pause()
  : globalData.channel.send("im not connected");
}

exports.default = {
  execute,
  alias: ["pa"]
};
