import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";

const execute = async (interaction: CommandInteraction) => {
  const messageManager = interaction.channel.messages;

  await interaction.reply("Started wiping the channel history");

  let messages = await messageManager.fetch({ limit: 100 });

  if (messages.values.length === 1) {
    messages = await messageManager.fetch({ limit: 100 });
  }

  messages.filter((m) => m.author.bot);

  let counter = 0;

  for (const [, msg] of messages) {
    if (msg.deletable) {
      await msg.delete();
      counter++;
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
