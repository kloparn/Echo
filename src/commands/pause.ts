import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import sendMessage from "../helpers/sendMessage";
const globalData = ClientMemory.getInstance();

const execute = () => {
  if (globalData.isConnectedToVoice) {
    if(!globalData.paused) {
      globalData.dispatcher.pause(); 
      clientHandler.updatePlaying();
      sendMessage(`Paused song`);
    } else {
      sendMessage("Im already paused")
    }
  } else {
    sendMessage("im not connected");
  }
}

exports.default = {
  execute,
  alias: ["pa"]
};
