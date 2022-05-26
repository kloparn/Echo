import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();


const execute = () => {
  if(globalData.isConnectedToVoice) {
    if(!globalData.paused) {
      globalData.channel.send("Cannot resume something that is currently playing :(")
    } else {
      clientHandler.updatePlaying();
      globalData.dispatcher.resume();
      globalData.channel.send(`Resuming`);
    }
  } else {
    globalData.channel.send("im not connected");
  }
};

export default {
  execute,
  alias: ["r", "res"]
}
