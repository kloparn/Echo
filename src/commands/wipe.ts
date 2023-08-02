import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { deleteReply } from "../helpers/messageHelper";
import { Command } from "../interfaces";

const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  const botId = globalData.client.user.id;

  const messageManager = interaction.channel.messages;

  await interaction.reply("Started wiping the channel history");

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

  const textMessage = await interaction.channel.send(`Deleted ${counter} messages from channel`);

  setTimeout(() => {
    textMessage.delete();
  }, 5_000);
};

export default {
  data: new SlashCommandBuilder().setName("wipe").setDescription("Tries to wipe the history of the bot in the current channel"),
  execute,
} as Command;
