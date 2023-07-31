import { AudioPlayerStatus, entersState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.player.state.status === AudioPlayerStatus.Playing) {
    const position = interaction.options.get("position")?.value;

    if (!position) {
      globalData.player.stop();

      await interaction.reply("Skipped current song...");
    } else {
      const queueObject = globalData.queue.splice((position as number) - 1, 1)[0];

      await interaction.reply(`Removed ${queueObject.title} from queue!`);
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
