import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
import QueueObject from "../interfaces/queue-interface";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
};

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue"),
  execute,
} as Command;
