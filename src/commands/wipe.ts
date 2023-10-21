import { Collection, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { deleteReply } from "../helpers/messageHelper";
import { Command } from "../interfaces";

const execute = async (interaction: CommandInteraction) => {
  const messageManager = interaction.channel.messages;

  await interaction.editReply("Started wiping the channel history");

  let ealiestMessageId: string;
  let messages: Collection<string, Message<true>> = new Collection();

  while (true) {
    const options = ealiestMessageId ? { limit: 100, before: ealiestMessageId } : { limit: 100 };
    const fetchedMessages = await messageManager.fetch(options);

    fetchedMessages.sweep((msg) => !msg.id);

    ealiestMessageId = fetchedMessages.last().id;

    // only adding the bot messages in the "to delete" pile
    const filteredMessages = fetchedMessages.filter((m) => m.author.bot && m.deletable);

    for (const [key, value] of filteredMessages) {
      messages.set(key, value);
    }

    if (fetchedMessages.size !== 100) break;
  }

  const promiseArray: Array<Promise<Message<true>>> = [];

  for (const [, msg] of messages) {
    promiseArray.push(msg.delete());
  }

  await Promise.all(promiseArray);

  await interaction.editReply(`Deleted ${promiseArray.length} messages from channel`);

  deleteReply(interaction, 5_000);
};

export default {
  data: new SlashCommandBuilder().setName("wipe").setDescription("Tries to wipe the history of the bot in the current channel"),
  execute,
} as Command;
