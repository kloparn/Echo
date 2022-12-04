import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import sendMessage from "../helpers/sendMessage";
const globalData = ClientMemory.getInstance();

const execute = (args, msg, timeOut) => {
  if (globalData.isConnectedToVoice) {
    {
      if (!globalData.dispatcher && timeOut) {
        clientHandler.destroyClient();
      }
      if (timeOut === undefined) {
        clientHandler.destroyClient();
      }
      if (typeof timeOut === "string") {
        clientHandler.destroyClient();
      }
    }
  } else {
    if (!timeOut) return sendMessage("im not connected");
  }
};

export default {
  execute: execute,
  alias: [],
};
