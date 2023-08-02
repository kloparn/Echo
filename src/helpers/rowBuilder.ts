import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { buttonType } from "../enums";

export default () => {
  const buttons: Array<ButtonBuilder> = [];

  for (const [key, value] of Object.entries(buttonType)) {
    const btn = new ButtonBuilder().setCustomId(key).setLabel(value).setStyle(ButtonStyle.Primary);

    buttons.push(btn);
  }

  const row: ActionRowBuilder<any> = new ActionRowBuilder().addComponents(...buttons);

  return row;
};
