import ClientMemory from "../classes/ClientMemory";
import ytdl from "ytdl-core-discord";
import search, { YouTubeSearchOptions, YouTubeSearchResults } from "youtube-search";
import clientHandler from "./clientHandler";
import stop from "../commands/stop";
import { Readable } from "stream";
import { validateURL } from "ytdl-core";
import { Message } from "discord.js";

const globalData = ClientMemory.getInstance();

const opts: YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.GOOGLE_KEY,
};

interface videoObject {
  link: string;
  title: string;
}

const listenOnFinishEvent = () => {
  if (globalData.dispatcher) {
    globalData.dispatcher.on("finish", async () => {
      const nextSearch = clientHandler.getFromQueue();

      if (!nextSearch) {
        startDisconnectTimeout();
      } else {
        await playVideo(await getVideo(nextSearch));
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

const playVideo = async (video: videoObject, directLink?: string | undefined): Promise<any> => {
  if (!video) {
    await messageChannel("No video was found from the given link/title");
    return;
  }

  try {
    const youtubeStreamable: Readable = await ytdl(directLink || video.link);
    clientHandler.setDispatcher(globalData.connection.play(youtubeStreamable, { type: "opus" }));
    await messageChannel(`Playing: ${video.title}\nurl: <${video.link}>`);
  } catch (e) {
    await messageChannel("Could not start song...");
    const nextSearch = clientHandler.getFromQueue();

    if (!nextSearch) {
      return startDisconnectTimeout();
    } else {
      if (validateURL(nextSearch)) {
        return await playVideo(await getVideo(nextSearch), nextSearch);
      } else {
        return await playVideo(await getVideo(nextSearch));
      }
    }
  }
};

const messageChannel = (str: string): Promise<Message> => globalData.channel.send(str);

const getVideo = async (uri: string): Promise<videoObject | null> => {
  const videos: YouTubeSearchResults[] = (await trySearch(uri, "Could not find any video...")).results;

  if (!videos || !videos[0]) return null;

  for (const video of videos) {
    if (video.link.includes("playlist")) continue;

    return { link: video.link, title: video.title };
  }

  return null;
};

const trySearch = async (find: string, errMsg: string): Promise<{results: search.YouTubeSearchResults[], pageInfo: search.YouTubeSearchPageResults}> => {
  try {
    return await search(find, opts);
  } catch (e) {
    await messageChannel(errMsg);
    return null;
  }
};

export const playSound = async (search: string) => {
  if (!search || search.length === 0) return;

  const video: videoObject | null = await getVideo(search);

  if (validateURL(search)) {
    await playVideo(video, search);
  } else {
    await playVideo(video);
  }

  listenOnFinishEvent();
};
