import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { VideoSearchResult } from "yt-search";
import * as buildEmbed from "../helpers/buildEmbed";
import * as rowBuilder from "../helpers/rowBuilder";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { searchForMultiple, searchVideo } from "../helpers/searchVideo";
import { Command } from "../interfaces";
import { deleteReply } from "../helpers/messageHelper";

const execute = async (interaction: CommandInteraction) => {
  const searchTerm = interaction.options.get("search").value;

  const videos = await searchForMultiple(searchTerm as string);

  interaction.editReply(`Got a search result of ${videos.length}, processing them...`);

  const workingVideos: VideoSearchResult[] = [];

  // we only process 4 videos at a time for memory purposes
  // yes this takes longer, but we give that information to the user!
  while (workingVideos.length < 4 && videos.length > 0) {
    const tempVideos = videos.splice(0, 4);

    const promiseArr = [];
    for (const video of tempVideos) {
      promiseArr.push(searchVideo(video.url));
    }

    const testedVideos = await Promise.allSettled(promiseArr);

    const _workingVideos = testedVideos.filter((it) => it.status === "fulfilled").map((it: PromiseFulfilledResult<VideoSearchResult>) => it.value);

    workingVideos.push(..._workingVideos);
  }

  interaction.editReply({
    embeds: [buildEmbed.searchResult(workingVideos)],
    components: [rowBuilder.searchButtons(workingVideos.map((it) => it.url))],
  });

  deleteReply(interaction, 25_000);
};

export default {
  data: new SlashCommandBuilder()
    .setName("pp")
    .setDescription("Search for 5 playable songs from a given query")
    .addStringOption((option) => option.setName("search").setDescription("Search term for youtube").setRequired(true)),
  execute,
} as Command;
