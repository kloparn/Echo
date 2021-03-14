import dotenv from "dotenv";
import Discord from "discord.js";
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
  try {
    const fn = require(`./commands/${commandName}.js`);
    fn(args, msg);
  } catch (err) {
    msg.channel.send(`${commandName} is not a function`);
    console.error(err);
  }
});

client.login(process.env.TOKEN);
