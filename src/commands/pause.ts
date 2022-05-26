import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();

const execute = () => {
  if (globalData.isConnectedToVoice) {
    if(!globalData.paused) {
      globalData.dispatcher.pause(); 
      clientHandler.updatePlaying();
      globalData.channel.send(`Paused song`);
    } else {
      globalData.channel.send("Im already paused")
    }
  } else {
    globalData.channel.send("im not connected");
  }
}

exports.default = {
  execute,
  alias: ["pa"]
};
