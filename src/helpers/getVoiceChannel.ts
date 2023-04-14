import { CommandInteraction, GuildMember } from "discord.js";
import ClientMemory from "../classes/ClientMemory";
const globalData = ClientMemory.getInstance();

export default (interaction: CommandInteraction) => {
  const guild = globalData.client.guilds.cache.get(interaction.guildId);
  const member = guild.members.cache.get(interaction.member.user.id);
  return member.voice.channel;
};
