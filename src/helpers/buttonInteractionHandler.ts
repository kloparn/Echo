import { ButtonInteraction, Collection } from "discord.js";
import { Command } from "../interfaces";
import { deleteReply } from "./messageHelper";

export default async (interaction: ButtonInteraction, commandsCollection: Collection<String, Command>) => {
  const response = interaction.customId.toLowerCase();

  let commando = commandsCollection.get(response);

  await interaction.deferReply({
    ephemeral: true,
  });

  // If we could not get the normal commando from the response
  // we assume it's a reaction from the pp command, so we handle it differently.
  if (!commando) {
    commando = commandsCollection.get("play");

    try {
      commando.execute(interaction, response);
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      commando.execute(interaction);
      deleteReply(interaction, 5_000);
    } catch (e) {
      console.log(e);
    }
  }

  return;
};
