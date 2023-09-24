import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { Command } from "../interfaces";
import { deleteReply } from "../helpers/messageHelper";
import { getPlaylistVideos } from "../helpers/searchVideo";
import play from "./play";

const execute = async (interaction: CommandInteraction) => {
  if (getVoiceChannel(interaction)) {
    const playlistUrl = interaction?.options?.get("playlistlink")?.value;
    const videoAmount = interaction?.options?.get("amount")?.value || 30;

    const playlistVideos = await getPlaylistVideos(playlistUrl as string); 

    for (let i = 0; i < videoAmount; i++) {
      /*
        Normally there would be no need to make a 1 second timeout here, but as every "Play" command
        should have it's own message attached to it, this is needed.

        There is a limit on how many times a message can be updated each second, so we limit how
        often the message is updated by adding the timeout!
      */

      if (!playlistVideos[i]?.title) continue;

      await new Promise((res) => {
        setTimeout(() => {
          if (i + 1 === videoAmount) play.execute(interaction, playlistVideos[i]?.title, true);
          else play.execute(interaction, playlistVideos[i].title, false);
          res("");
        }, 1_000);
      });
    }
  } else {
    await interaction.editReply("Could not perform this action!");
    deleteReply(interaction, 5_000);
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Adds up to 30 songs at once from a playlist!")
    .addStringOption((option) => option.setName("playlistlink").setDescription("A link to a youtube playlist!").setRequired(true))
    .addStringOption((option) => option.setName("amount").setDescription("How many songs in the playlist to play (up to 30)")),
  execute,
} as Command;
