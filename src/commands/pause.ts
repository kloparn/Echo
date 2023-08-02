import { AudioPlayerStatus, entersState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Playing) {
    globalData.player.pause();
    await entersState(globalData.player, AudioPlayerStatus.Paused, 5000);
    await interaction.editReply("Paused song");
  } else {
    await interaction.editReply("Could not perform this action!");
  }
};

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current playing song"),
  execute,
} as Command;
