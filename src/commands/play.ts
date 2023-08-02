import { joinVoiceChannel, AudioPlayerStatus } from "@discordjs/voice";
import { ActionRowComponent, CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import buildEmbed from "../helpers/buildEmbed";
import clientHandler from "../helpers/clientHandler";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { deleteReply } from "../helpers/messageHelper";
import playSound from "../helpers/playSound";
import rowBuilder from "../helpers/rowBuilder";
import { searchVideo } from "../helpers/searchVideo";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  const searchTerm: any = interaction.options.get("search").value;

  if (!globalData.connection) {
    // not connected to any voice channel
    const voiceChannel = getVoiceChannel(interaction);

    globalData.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    try {
      const video = await playSound(searchTerm);
      const playerEmbed = await interaction.channel.send({ embeds: [buildEmbed(video, globalData.queue)], components: [rowBuilder()] });

      await interaction.editReply("Started echo");

      deleteReply(interaction, 2_000);

      if (playerEmbed) {
        globalData.currentVideo = video;
        globalData.playerEmbed = playerEmbed;
      }
    } catch (err) {
      console.log(err);
      await interaction.editReply("Video is restricted, cannot play, leaving the channel.");
      const left = globalData.connection.disconnect();

      if (left) {
        clientHandler.destroyClient();
      }
    }
  } else {
    // already connected to a voice channel

    try {
      const video = await searchVideo(searchTerm);
      clientHandler.addToQueue(video);

      await globalData.playerEmbed.edit({ embeds: [buildEmbed(video, globalData.queue)] });

      await interaction.editReply(`Added: ${video.title} to the queue\nPosition in queue: ${globalData.queue.length}`);
    } catch (e) {
      await interaction.editReply("Video is restricted, cannot play");
    }

    deleteReply(interaction, 10_000);
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays something from youtube")
    .addStringOption((option) => option.setName("search").setDescription("A link or a search term for youtube").setRequired(true)),
  execute,
} as Command;
