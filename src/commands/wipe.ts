import { Collection, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { exit } from "process";
import { Command } from "../interfaces";
import resume from "./resume";

const execute = async (interaction: CommandInteraction) => {
  const messageManager = interaction.channel.messages;

  await interaction.editReply("Started wiping the channel history");

  let ealiestMessageId: string;
  let messages: Collection<string, Message<true>> = new Collection();

  while (true) {
    const options = ealiestMessageId ? { limit: 100, before: ealiestMessageId } : { limit: 100 };
    const fetchedMessages = await messageManager.fetch(options);

    ealiestMessageId = fetchedMessages.last().id;

    for (const [key, value] of fetchedMessages) {
      messages.set(key, value);
    }

    if (fetchedMessages.size !== 100) break;
  }

  messages = messages.filter((m) => m.author.bot && m.deletable);

  const promiseArray: Array<Promise<Message<true>>> = [];

  for (const [, msg] of messages) {
    promiseArray.push(msg.delete());
  }

  await Promise.all(promiseArray);

  const textMessage = await interaction.channel.send(`Deleted ${promiseArray.length} messages from channel`);

  setTimeout(() => {
    textMessage.delete();
  }, 5_000);
};

export default {
  data: new SlashCommandBuilder().setName("wipe").setDescription("Tries to wipe the history of the bot in the current channel"),
  execute,
} as Command;
