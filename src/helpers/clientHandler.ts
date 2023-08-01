import { VideoSearchResult } from "yt-search";
import ClientMemory from "../classes/ClientMemory";

const globalData = ClientMemory.getInstance();

const addToQueue = (it: VideoSearchResult) => globalData.queue.push(it);

const getFromQueue = (): VideoSearchResult => globalData.queue.shift();

const destroyClient = () => {
  ClientMemory.wipeInstance();
};

export default {
  destroyClient: destroyClient,
  addToQueue: addToQueue,
  getFromQueue: getFromQueue,
};
