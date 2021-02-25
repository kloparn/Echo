const Discord = require("discord.js");
const client = new Discord.Client();
const { token, prefix } = require("./config.json");
const voiceConnected = require("./helpers/voiceConnected");
const playSound = require("./helpers/playSound");
const queue = [];

let user;
let dispatcher;


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  user = client.user;
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  // Setup command and args.
  const args = msg.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  switch (commandName) {
    case "play":
      if(!msg.member.voice.channel) return msg.reply(`You are currently not in a channel`)

      const connection = await msg.member.voice.channel.join();

      //returns a dispatcher to be used to check queue or other stuff
      dispatcher = await playSound(connection, args.join(" "));

      setupEvents(dispatcher);

      return  msg.reply(`playing: ${args.join(" ")}`);
    case "stop":
      if (!voiceConnected(client, user)) return msg.reply("im not connected");

      return msg.member.voice.channel.leave();
    case "pause":
      if(!voiceConnected(client, user)) return msg.reply("im not connected");

      return dispatcher.pause();
    case "resume": 
    if(!voiceConnected(client, user)) return msg.reply("im not connected");

      return dispatcher.resume();
    case "leave":
      return msg.member.voice.channel.leave();
    default:
      break;
  }
});

client.login(token);
