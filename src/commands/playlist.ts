import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";
import { getPlaylistVideos } from "../helpers/searchVideo";
import play from "./play";
import sleep from "../helpers/sleep";

const execute = async (interaction: CommandInteraction) => {
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

    await sleep(1000);

    if (i + 1 === videoAmount) play.execute(interaction, playlistVideos[i]?.title, true);
    else play.execute(interaction, playlistVideos[i].title, false);
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
