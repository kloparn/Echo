import ClientMemory from "../classes/ClientMemory";
import ytdl from "ytdl-core-discord";
import search from "youtube-search";
import clientHandler from "./clientHandler";
import stop from "../commands/stop";
import internal from "stream";

const globalData = ClientMemory.getInstance();

const options = {
  maxResults: 1,
  key: process.env.GOOGLE_KEY,
};

export const playSound = async (url: string) => {
  if(!url) return;

  let youtubeSearchData: Promise<[]>;
  let link;

  if (url.includes("https")) {
    try {
      youtubeSearchData = await searchAsync(url);
    } catch (err) {
      return globalData.channel.send("Could not retrieve video information");
    }

    if(!youtubeSearchData[0]) {
      if(globalData.queue.length > 0) {
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

    if (!youtubeSearchData[0])
      return globalData.channel.send("Didn't get a search result");

    const { link: youtubeLink, title } = youtubeSearchData[0];
    link = youtubeLink;

    globalData.channel.send(`Playing: ${title}\nUrl: <${youtubeLink}>`);
  }

  try {
    clientHandler.setDispatcher(
      globalData.connection.play(await ytdl(link || url), { type: "opus"})
    );
  } catch (err) {
    globalData.channel.send("Could not play song...");
    const url = clientHandler.getFromQueue();
    if (!url) {
      clientHandler.setDispatcher(null);
      setTimeout(() => {
        stop.execute([], null, true);
      }, 300000);
    };
  
    await playSound(url);
  }

  globalData.dispatcher.on("finish", async () => {
    const url = clientHandler.getFromQueue();
    if (!url) {
      clientHandler.setDispatcher(null);
      setTimeout(() => {
        stop.execute([], null, true);
      }, 300000);
    };
  
    await playSound(url);
  });
};


const searchAsync = async (url): Promise<any> => {
  return new Promise((resolve, reject) => {
    search(url, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
