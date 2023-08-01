import { AudioPlayerStatus, entersState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import buildEmbed from "../helpers/buildEmbed";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Playing) {
    const position = interaction.options.get("position")?.value;

    if (!position) {
      globalData.player.stop();

      await interaction.reply("Skipped current song...");
    } else {
      const video = globalData.queue.splice((position as number) - 1, 1)[0];

      await globalData.playerEmbed.edit({ embeds: [buildEmbed(video, globalData.queue)]})

      await interaction.reply(`Removed ${video.title} from queue!`);
    }
  } else {
    await interaction.reply("Could not perform this action!");
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song")
    .addNumberOption((option) => option.setName("position").setDescription("what queue position to delete from the queue")),
  execute,
} as Command;
