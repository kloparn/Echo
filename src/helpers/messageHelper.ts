import { ButtonInteraction, CommandInteraction } from "discord.js";

const deleteReply = (interaction: ButtonInteraction | CommandInteraction, timeBeforeDeletion: number) => {
  setTimeout(async () => {
    await interaction.deleteReply();
  }, timeBeforeDeletion);
};

export { deleteReply };
