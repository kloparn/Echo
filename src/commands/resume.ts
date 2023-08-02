import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
import { AudioPlayerStatus, entersState } from "@discordjs/voice";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Paused) {
    globalData.player.unpause();
    await entersState(globalData.player, AudioPlayerStatus.Playing, 5000);
    await interaction.editReply("Continuing the song!");
  } else {
    await interaction.editReply("Could not perform this action!");
  }
};

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Continues from where it was previously paused"),
  execute,
} as Command;
