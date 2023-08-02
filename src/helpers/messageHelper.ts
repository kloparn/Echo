import { CommandInteraction } from "discord.js";

const deleteReply = (interaction: CommandInteraction, timeBeforeDeletion: number) => {
  setTimeout(async () => {
    await interaction.deleteReply();
  }, timeBeforeDeletion);
};

export { deleteReply };
