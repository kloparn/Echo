import dotenv from "dotenv";
import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import initializeCommands from "./helpers/initializeCommands";
import ClientMemory from "./classes/ClientMemory";
import { deleteReply } from "./helpers/messageHelper";
import buttonInteractionHandler from "./helpers/buttonInteractionHandler";
import { Command } from "./interfaces/index";
import getVoiceChannel from "./helpers/getVoiceChannel";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

ClientMemory.setClient(client);

let commandsCollection: Collection<String, Command>;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  commandsCollection = await initializeCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Guard clauses

  // Pressed on the buttons on the music player!
  if (interaction.isButton()) return await buttonInteractionHandler(interaction, commandsCollection);

  // If the giving interaction is not from the chat
  if (!interaction.isChatInputCommand()) return;

  // The user has to be in a voice channel to use the bot, except for the wipe command
  if (interaction.commandName !== "wipe" && !getVoiceChannel(interaction)) {
    await interaction.reply({ ephemeral: true, content: "Need to be connected to a voice channel!" });
    deleteReply(interaction, 3_000);
    return;
  }

  try {
    const commando = commandsCollection.get(interaction.commandName);

    if (!commando) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    await interaction.deferReply({
      ephemeral: true,
    });

    await commando.execute(interaction);

    if (!["play", "wipe", "pp"].reduce((b, r) => (b === true ? true : r === interaction.commandName ? true : false), false)) {
      console.log("Not a rule obeying command");
      deleteReply(interaction, 10_000);
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
    deleteReply(interaction, 10_000);
  }
});

client.login(process.env.TOKEN);
