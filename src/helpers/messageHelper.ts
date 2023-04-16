import { CommandInteraction } from "discord.js";

const deleteReply = (interaction: CommandInteraction, timeBeforeDeletion: number) => {
  setTimeout(() => {
    interaction.deleteReply();
  }, timeBeforeDeletion);
};

export { deleteReply };
