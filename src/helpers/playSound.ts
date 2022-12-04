import ClientMemory from "../classes/ClientMemory";
import ytdl from "ytdl-core-discord";
import clientHandler from "./clientHandler";
import stop from "../commands/stop";
import { Readable } from "stream";
import { validateURL } from "ytdl-core";
import sendMessage from "./sendMessage";
import { QueueObject, VideoObject } from "../interfaces";
import getVideo from "./getVideoInformation";

const globalData = ClientMemory.getInstance();

const listenOnFinishEvent = () => {
  if (globalData.dispatcher) {
    globalData.dispatcher.on("finish", async () => {
      const nextVideo: QueueObject = clientHandler.getFromQueue();

      if (!nextVideo) {
        startDisconnectTimeout();
      } else {
        await playVideo(nextVideo);
      }
    });
  }
};

const startDisconnectTimeout = () => {
  clientHandler.setDispatcher(null);
  setTimeout(() => {
    stop.execute([], null, true);
  }, 300_000);
};

const playVideo = async (VideoObject: QueueObject | undefined): Promise<any> => {
  if (!VideoObject) {
    await sendMessage("No video was found from the given link/title");
    return null;
  }

  try {
    const youtubeStreamable: Readable = await ytdl(VideoObject.link.toString());
    clientHandler.setDispatcher(globalData.connection.play(youtubeStreamable, { type: "opus" }));
    await sendMessage(`Playing: ${VideoObject.title}\nurl: <${VideoObject.link.toString()}>`);
    listenOnFinishEvent();
  } catch (e) {
    await sendMessage("Could not start song...");
    const VideoObject: QueueObject = clientHandler.getFromQueue();

    if (!VideoObject) {
      return startDisconnectTimeout();
    } else {
      return await playVideo(VideoObject);
    }
  }
};

export const playSound = async (videoObject: QueueObject) => {
  if (!videoObject) return;

  console.log(videoObject);

  await playVideo(videoObject);
};
