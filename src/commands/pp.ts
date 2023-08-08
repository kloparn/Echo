import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { VideoSearchResult } from "yt-search";
import * as buildEmbed from "../helpers/buildEmbed";
import * as rowBuilder from "../helpers/rowBuilder";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { searchForMultiple, searchVideo } from "../helpers/searchVideo";
import { Command } from "../interfaces";
import { deleteReply } from "../helpers/messageHelper";

const execute = async (interaction: CommandInteraction) => {
  if (getVoiceChannel(interaction)) {
    const searchTerm: any = interaction.options.get("search").value;

    const videos = await searchForMultiple(searchTerm);

    interaction.editReply(`Got a search result of ${videos.length}, processing them...`);

    const promiseVideos = videos.map((video) => searchVideo(video.url));

    const testedVideos = await Promise.allSettled(promiseVideos);

    const workingVideos: VideoSearchResult[] = testedVideos.filter((vid) => vid.status === "fulfilled").map((vid: any) => vid.value);

    interaction.editReply({
      embeds: [buildEmbed.searchResult(workingVideos)],
      components: [rowBuilder.searchButtons(workingVideos.map((it) => it.url))],
    });

    deleteReply(interaction, 25_000);
  } else {
    await interaction.editReply("Could not perform this action!");
    deleteReply(interaction, 5_000);
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("pp")
    .setDescription("Search for 5 songs from a given query")
    .addStringOption((option) => option.setName("search").setDescription("Search term for youtube").setRequired(true)),
  execute,
} as Command;
