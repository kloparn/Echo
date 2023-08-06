import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
import clientHandler from "../helpers/clientHandler";
import getVoiceChannel from "../helpers/getVoiceChannel";
import { Command } from "../interfaces";
const globalData = ClientMemory.getInstance();

const execute = async (interaction: CommandInteraction) => {
  if (globalData.client.voice.adapters.size > 0 && getVoiceChannel(interaction)) {
    globalData.player.stop();
    if (globalData.connection.disconnect()) {
      if (globalData.playerEmbed.deletable) {
        await globalData.playerEmbed.delete();
      }
      clientHandler.destroyClient();
      if (interaction.isRepliable()) {
        await interaction.editReply("Stopping the player...");
      }
    }
  }
};

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription("stopping the bot and removing it from the channel"),
  execute,
} as Command;
