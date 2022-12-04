import dotenv from "dotenv";
import Discord from "discord.js";
import fs from "fs";
dotenv.config();

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg: Discord.Message) => {
  if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;

  // Setup command and args.
  let args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
  const userId = msg.author.id
  const commandName = args.shift().toLowerCase();

  // First it tries to find a file with the command given
  try {
    const { default: command } = require(`./commands/${commandName}.js`);
    command.execute(args, msg, userId);
  } catch (_) /* no command found */ {
    // Getting all avaiable commands to search if the given command is a alias
    const files: string[] = await fs.promises.readdir("./dist/commands");

    for (const file of files) {
      const { default: command } = require(`./commands/${file}`);
      if (command.alias.includes(commandName)) {
        command.execute(args, msg, userId);
        return;
      }
    }

    return msg.channel.send(`Sorry did not recognize the command *${commandName}*`);
  }
});

client.login(process.env.TOKEN);
