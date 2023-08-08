import { EmbedBuilder } from "discord.js";
import { VideoSearchResult } from "yt-search";
import ClientMemory from "../classes/ClientMemory";

const globalData = ClientMemory.getInstance();

interface fieldObject {
  name: string;
  value: string;
}

const player = (video: VideoSearchResult, queue: Array<VideoSearchResult>) => {
  if (globalData.currentVideo) video = globalData.currentVideo;

  const queueFields: Array<fieldObject> = queue.reduce((items, item, index) => {
    if (index > 5) return items;
    items.push({ name: `Position: ${index + 1}`, value: `${item.title} | <${item.url}>` });

    return items;
  }, []);

  const messageEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Playing: ${video.title}`)
    .setURL(video.url)
    .setAuthor({ name: "Echo music player" })
    .setThumbnail(video?.thumbnail)
    .addFields(...queueFields)
    .setTimestamp()
    .setFooter({ text: "echo" });

  return messageEmbed;
};

const searchResult = (videos: VideoSearchResult[]) => {
  const searchField: Array<fieldObject> = videos.reduce((items, item, index) => {
    if (index > 4) return items;
    items.push({ name: `Result: ${index + 1} | duration: ${item.duration.timestamp}`, value: `${item.title} | <${item.url}>` });

    return items;
  }, []);

  const messageEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Search results`)
    .setAuthor({ name: "Echo music player" })
    .addFields(...searchField)
    .setTimestamp()
    .setFooter({ text: "echo" });

  return messageEmbed;
};

export { player, searchResult };
