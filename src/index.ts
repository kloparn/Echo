import dotenv from "dotenv";
import Discord from "discord.js";
import fs from "fs";
dotenv.config();

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;

  // Setup command and args.
  let args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // First it tries to find a file with the command given
  try {
    const { default: command } = require(`./commands/${commandName}.js`);
    command.execute(args, msg);
  } catch (_) { // It could not find the file with the command given

    let fileFound = false;

    // Getting all avaiable commands to search if the given command is a alias
    const files: any = await fs.promises.readdir("./dist/commands");

    files.every((file: string) => {
      const { default: commandFile} = require(`./commands/${file}`)
      // Checks if the given command is a alias for the current command file.
      if(commandFile.alias.includes(commandName)){
        commandFile.execute(args, msg);
        fileFound = true
        return false; // Stops the loop early.
      }
      return true;
    })
    if (!fileFound)
      msg.channel.send(`Sorry did not recognize the command *${commandName}*`);
  }
});

client.login(process.env.TOKEN);
