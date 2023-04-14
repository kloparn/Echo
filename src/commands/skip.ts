import { AudioPlayerStatus, entersState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Playing) {
    globalData.player.stop();
    entersState(globalData.player, AudioPlayerStatus.Idle, 5000);
    interaction.reply("Skipped current song...");
  } else {
    interaction.reply("Could not perform this action!");
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song")
    .addNumberOption((option) => option.setName("position").setDescription("what queue position to delete from the queue")),
  execute,
} as Command;
