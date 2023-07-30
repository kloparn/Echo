import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.client.voice.adapters.size > 0) {
    globalData.player.stop();
    if (globalData.connection.disconnect()) {
      clientHandler.destroyClient();
      await interaction.reply("Stopping the player...");
    }
  }
};

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription("stopping the bot and removing it from the channel"),
  execute,
} as Command;
