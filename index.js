const Discord = require("discord.js");
const client = new Discord.Client();
const { token, prefix } = require("./config.json");
const voiceConnected = require("./helpers/voiceConnected");
const playSound = require("./helpers/playSound");
const setupEvents = require("./helpers/setupEvents");
const destroyClientConnection = require("./helpers/destroyCustomAttributes");

let user;
client.queue = client.queue || [];

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

      if(!client.voiceChannelReference) client.voiceChannelReference = msg.member.voice.channel;
      if(!client.channelReference) client.channelReference = msg.channel;
      if(!client.connection) client.connection = await msg.member.voice.channel.join();

      if(client.dispatcher) {
        client.queue.push({ str : args.join(" "), endEvent : setupEvents });
        return msg.channel.send(`Added '${args.join(" ")}' to the queue`);
      }
      //returns a dispatcher to be used to check queue or other stuff
      client.dispatcher = await playSound(client.connection, args.join(" "));
      setupEvents(client);

      return  msg.reply(`playing: ${args.join(" ")}`);
    case "skip":
      if(!voiceConnected(client, user)) return msg.reply("im not connected");
      return client.dispatcher.end();
    case "stop" :
    case "leave":
      if (!voiceConnected(client, user)) return msg.reply("im not connected");
      client.dispatcher.destroy()
      destroyClientConnection(client);
      return msg.member.voice.channel.leave();
    case "pause":
      if(!voiceConnected(client, user)) return msg.reply("im not connected");
      return client.dispatcher.pause();
    case "resume": 
    if(!voiceConnected(client, user)) return msg.reply("im not connected");
      return client.dispatcher.resume();
    default:
      break;
  }
});

client.login(token);
