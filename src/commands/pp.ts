import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";

const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Sorry not done yet");
};

export default {
  data: new SlashCommandBuilder().setName("pp").setDescription("Search for 5 songs from a given query"),
  execute,
} as Command;
