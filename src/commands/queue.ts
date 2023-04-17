import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
import QueueObject from "../interfaces/queue-interface";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  const queueString = globalData.queue.reduce((str: string, currSong: any, index: number) => {
    str += `${index + 1}: ${currSong.title}\n`;
    return str;
  }, "");

  interaction.reply(queueString);
};

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue"),
  execute,
} as Command;
