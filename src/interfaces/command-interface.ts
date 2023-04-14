import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
  readonly data: SlashCommandBuilder;
  readonly execute: (interaction: CommandInteraction) => Promise<void>;
}
