import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
import { AudioPlayerStatus, entersState } from "@discordjs/voice";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Paused) {
    globalData.player.unpause()
    entersState(globalData.player, AudioPlayerStatus.Playing, 5000);
    interaction.reply("Continuing the song!")
  } else {
    interaction.reply("Could not perform this action!");
  }
};

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Continues from where it was previously paused"),
  execute,
} as Command;
