import ClientMemory from "../classes/ClientMemory";
import ytdl from "ytdl-core-discord";
import search from "youtube-search";
import clientHandler from "./clientHandler";
import stop from "../commands/stop";

const globalData = ClientMemory.getInstance();

const options = {
  maxResults: 1,
  key: process.env.GOOGLE_KEY,
};

export const playSound = async (url: string) => {
  if (url.includes("https")) {
    clientHandler.setDispatcher(globalData.connection.play(await ytdl(url), { type: "opus" }));
    const youtubeVideoInfo = await searchAsync(url); 
    globalData.channel.send(`Playing: ${youtubeVideoInfo[0].title}\nurl: <${youtubeVideoInfo[0].link}>`);
  } else {
    const youtubeSearchData = await searchAsync(url);

    if (!youtubeSearchData[0])
      return globalData.channel.send("Didn't get a search result");

    const { link, title } = youtubeSearchData[0];

    globalData.channel.send(`Playing : ${title}\nUrl: <${link}>`);
    clientHandler.setDispatcher(
      globalData.connection.play(await ytdl(link), { type: "opus" })
    );
  }
  globalData.dispatcher.on("finish", async () => {
    const url = clientHandler.getFromQueue();
    if (!url) return stop();
  
    await playSound(url);
  });
};


const searchAsync = async (url) => {
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
