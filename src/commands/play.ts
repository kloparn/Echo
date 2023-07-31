import { joinVoiceChannel, AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { deleteReply } from "../helpers/messageHelper";
import playSound from "../helpers/playSound";
import { searchVideo } from "../helpers/searchVideo";
import { Command, VideoObject } from "../interfaces";
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
      const interactionReplyString = await playSound(searchTerm);
      const successResponse = await interaction.reply(interactionReplyString);
      if (successResponse) globalData.playingInteraction = interaction;
    } catch (err) {
      console.log(err);
      await interaction.reply("Could not play..");
    }
  } else {
    // already connected to a voice channel

    const video: VideoObject = await searchVideo(searchTerm);

    clientHandler.addToQueue({ link: video.link, title: video.title });

    await interaction.reply(`Added: ${video.title} to the queue\nPosition in queue: ${globalData.queue.length}`);

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
