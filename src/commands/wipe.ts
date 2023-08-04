import { Collection, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";

const execute = async (interaction: CommandInteraction) => {
  const searchAmount: any = [0, interaction.options?.get("look-back-amount")?.value];

  searchAmount[1] = searchAmount[1] % 100;

  const messageManager = interaction.channel.messages;

  await interaction.editReply("Started wiping the channel history");

  let ealiestMessageId: string;
  let messages: Collection<string, Message<true>> = new Collection();

  while (searchAmount[0] < searchAmount[1]) {
    const options = ealiestMessageId ? { limit: 100, before: ealiestMessageId } : { limit: 100 };
    const fetchedMessages = await messageManager.fetch(options);

    ealiestMessageId = fetchedMessages.last().id;

    // only adding the bot messages in the "to delete" pile
    const filteredMessages = fetchedMessages.filter((m) => m.author.bot && m.deletable);

    for (const [key, value] of filteredMessages) {
      messages.set(key, value);
    }

    if (fetchedMessages.size !== 100) break;
    searchAmount[0]++;
  }

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
  data: new SlashCommandBuilder()
    .setName("wipe")
    .setDescription("Tries to wipe the history of the bot in the current channel")
    .addNumberOption((option) => option.setName("look-back-amount").setDescription("How many messages back should i look?").setRequired(true)),
  execute,
} as Command;
