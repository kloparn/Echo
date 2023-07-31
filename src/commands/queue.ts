import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import isValidUrl from "../helpers/isValidUrl";
import { Command, QueueObject } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  const queueString = globalData.queue.reduce((str: string, currSong: QueueObject, index: number) => {
    str += `${index + 1}: ${currSong.title} | <${currSong.link}>\n`;
    return str;
  }, "");

  await interaction.reply(!queueString.length ? "Nothing in queue" : queueString);
};

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue"),
  execute,
} as Command;
