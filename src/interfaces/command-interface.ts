import { ButtonInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
  readonly data: SlashCommandBuilder;
  readonly execute: (interaction: CommandInteraction | ButtonInteraction, searchTerm?: string) => Promise<void>;
}
