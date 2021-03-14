import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
const globalData = ClientMemory.getInstance();

export = () => {
  globalData.voiceStatus
    ? clientHandler.destroyClient()
    : globalData.channel.send("im not connected");
};
