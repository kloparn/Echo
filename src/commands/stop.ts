import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.isConnectedToVoice
    ? clientHandler.destroyClient()
    : globalData.channel.send("im not connected");
};
