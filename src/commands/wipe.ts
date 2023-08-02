import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { Command } from "../interfaces";

const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  const botId = globalData.client.user.id;

  const messageManager = interaction.channel.messages;

  const messages = await messageManager.fetch({ limit: 100 });

  let counter = 0;

  for (const [, msg] of messages) {
    if (msg.author.id === botId) {
      if (msg.deletable) {
        await msg.delete();
        counter++;
      }
    }
  }

  await interaction.reply(`Deleted ${counter} messages from channel`);
};

export default {
  data: new SlashCommandBuilder().setName("wipe").setDescription("Tries to wipe the history of the bot in the current channel"),
  execute,
} as Command;
