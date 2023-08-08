import dotenv from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import initializeCommands from "./helpers/initializeCommands";
import ClientMemory from "./classes/ClientMemory";
import { deleteReply } from "./helpers/messageHelper";
import buttonInteractionHandler from "./helpers/buttonInteractionHandler";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

ClientMemory.setClient(client);

let commandsCollection;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  commandsCollection = await initializeCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) return await buttonInteractionHandler(interaction, commandsCollection);
  if (!interaction.isChatInputCommand()) return;

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
    if (interaction.commandName !== "play" && interaction.commandName !== "wipe" && interaction.commandName !== "pp") {
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
