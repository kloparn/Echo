import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();

export = (args, msg, timeOut) => {
  console.log(timeOut);
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
    return globalData.channel.send("im not connected");
  }
};
