import { ButtonInteraction, CommandInteraction } from "discord.js";

let justDeletedId;

const deleteReply = (interaction: ButtonInteraction | CommandInteraction, timeBeforeDeletion: number) => {
  setTimeout(async () => {
    if (justDeletedId !== interaction.id) {
      await interaction.deleteReply();
      justDeletedId = interaction.id;
    }
  }, timeBeforeDeletion);
};

export { deleteReply };
