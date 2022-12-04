import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import sendMessage from "../helpers/sendMessage";
const globalData = ClientMemory.getInstance();

const execute = () => {
  if (globalData.isConnectedToVoice) {
    if (!globalData.paused) {
      sendMessage("Cannot resume something that is currently playing :(");
    } else {
      clientHandler.updatePlaying();
      globalData.dispatcher.resume();
      sendMessage(`Resuming`);
    }
  } else {
    sendMessage("im not connected");
  }
};

export default {
  execute,
  alias: ["r", "res"],
};
