import { ButtonInteraction, CommandInteraction } from "discord.js";
import { deleteReply } from "./messageHelper";

export default async (interaction: ButtonInteraction, commandsCollection: any) => {
  const response = interaction.customId.toLowerCase();

  const commando = commandsCollection.get(response);

  await interaction.deferReply({
    ephemeral: true,
  });

  try {
    commando.execute(interaction);
    deleteReply(interaction, 5_000);
  } catch (e) {
    console.log(e);
  }

  return;
};
