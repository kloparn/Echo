import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();

const execute = (args, msg, timeOut) => {
  if(globalData.isConnectedToVoice) {
    {
      if(!globalData.dispatcher && timeOut) {
        clientHandler.destroyClient();
      }
      if(timeOut === undefined){
        clientHandler.destroyClient();
      }
    }
  } else {
    if (!timeOut) return globalData.channel.send("im not connected");
  }
};

export default {
  execute: execute,
  alias: []
}
