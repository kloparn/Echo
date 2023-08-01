import { EmbedBuilder } from "discord.js";
import { VideoSearchResult } from "yt-search";
import ClientMemory from "../classes/ClientMemory";

const globalData = ClientMemory.getInstance();

export default (video: VideoSearchResult, queue: Array<VideoSearchResult>) => {
  if (globalData.currentVideo) video = globalData.currentVideo;

  const queueFields: any = queue.reduce((items, item, index) => {
    if (index > 5) return items;
    items.push({ name: `Position: ${index + 1}`, value: `${item.title} | <${item.url}>` });

    return items;
  }, []);

  // if (queueFields.length > 3) queueFields.push({ name: "Position: 4+", value: "More to come" });

  const messageEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Playing: ${video.title}`)
    .setURL(video.url)
    .setAuthor({ name: "Echo music player" })
    .setThumbnail(video?.thumbnail)
    .addFields(...queueFields)
    .setTimestamp()
    .setFooter({ text: `echo` });

  return messageEmbed;
};
