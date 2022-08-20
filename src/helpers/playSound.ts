import ClientMemory from "../classes/ClientMemory";
import ytdl from "ytdl-core-discord";
import search, { YouTubeSearchOptions } from "youtube-search";
import clientHandler from "./clientHandler";
import stop from "../commands/stop";
import { Readable } from "stream";

const globalData = ClientMemory.getInstance();

const opts: YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.GOOGLE_KEY,
};

export const playSound = async (url: any) => {
  if (!url) return;

  let youtubeSearchData: Promise<[]>;
  let link;

  if (url.includes("https")) {
    try {
      youtubeSearchData = await searchAsync(url);
    } catch (err) {
      return globalData.channel.send("Could not retrieve video information");
    }

    if (!youtubeSearchData[0]) {
      if (globalData.queue.length > 0) {
        globalData.channel.send(`Could not get a result from <${url}>`);
        globalData.channel.send("Playing next song in queue instead");

        return await playSound(clientHandler.getFromQueue());
      }

      return globalData.channel.send(`Could not get a result from <${url}>`);
    }

    globalData.channel.send(`Playing: ${youtubeSearchData[0].title}\nurl: <${youtubeSearchData[0].link}>`);
  } else {
    try {
      youtubeSearchData = await searchAsync(url);
    } catch (err) {
      return globalData.channel.send("Could not retrieve video information");
    }

    if (!youtubeSearchData[0]) return globalData.channel.send("Didn't get a search result");

    let { link: youtubeLink, title } = youtubeSearchData[0];

    while (youtubeLink.includes("playlist")) {
      let linkIndex = (await youtubeSearchData).findIndex((youtubeResults: any) => youtubeResults.link === youtubeLink);
      youtubeLink = youtubeSearchData[linkIndex + 1].link;
      title = youtubeSearchData[linkIndex + 1].title;
      if (!youtubeLink) return globalData.channel.send("Only found playlists in the results, skipping this search...");
    }

    link = youtubeLink;

    globalData.channel.send(`Playing: ${title}\nUrl: <${youtubeLink}>`);
  }

  try {
    const youtubeMP3: Readable = await ytdl(link || url);
    clientHandler.setDispatcher(globalData.connection.play(youtubeMP3, { type: "opus" }));
  } catch (err) {
    globalData.channel.send("Could not play song...");
    const url = clientHandler.getFromQueue();
    if (!url) {
      clientHandler.setDispatcher(null);
      setTimeout(() => {
        stop.execute([], null, true);
      }, 300000);
    }

    await playSound(url);
  }

  if (globalData.dispatcher !== null)
    globalData.dispatcher.on("finish", async () => {
      const url = clientHandler.getFromQueue();
      if (!url) {
        clientHandler.setDispatcher(null);
        setTimeout(() => {
          stop.execute([], null, true);
        }, 300000);
      }

      await playSound(url);
    });
};

const searchAsync = async (url): Promise<any> => {
  return new Promise((resolve, reject) => {
    search(url, opts, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
