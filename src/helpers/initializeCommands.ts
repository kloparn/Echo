import { REST, Routes, Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { Command } from "../interfaces";
import fs from "fs";

export default async () => {
  const commandsCollection = new Collection<String, Command>();

  const commands = await fs.promises.readdir("./dist/commands", "utf-8");

  for (const fileName of commands) {
    const { default: command } = require(`../commands/${fileName}`);

    commandsCollection.set(command.data.name, command);
  }

  await updateCommandsWithDiscordAPI(commandsCollection);

  return commandsCollection;
};

const updateCommandsWithDiscordAPI = async (commands: Collection<String, Command>) => {
  const commandsJson: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  commands.forEach((command) => commandsJson.push(command.data.toJSON()));

  const rest = new REST().setToken(process.env.TOKEN!);

  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),

      { body: commandsJson }
    );

    console.log(`Successfully reloaded ${data} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};
