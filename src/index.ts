import dotenv from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import initializeCommands from "./helpers/initializeCommands";
import ClientMemory from "./classes/ClientMemory";
import { deleteReply } from "./helpers/messageHelper";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

ClientMemory.setClient(client);

let commandsCollection;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  commandsCollection = await initializeCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commando = commandsCollection.get(interaction.commandName);

  if (!commando) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await commando.execute(interaction);
    if (interaction.commandName !== "play") {
      deleteReply(interaction, 5_000);
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);
