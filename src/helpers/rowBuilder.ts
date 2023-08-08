import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { buttonType } from "../enums";

const playerButtons = () => {
  const buttons: Array<ButtonBuilder> = [];

  for (const [key, value] of Object.entries(buttonType)) {
    const btn = new ButtonBuilder().setCustomId(key).setLabel(value).setStyle(ButtonStyle.Primary);

    buttons.push(btn);
  }

  const row: ActionRowBuilder<any> = new ActionRowBuilder().addComponents(...buttons);

  return row;
};

const searchButtons = (searchResults: string[]) => {
  const buttons = [];

  for (const searchString of searchResults) {
    if (buttons.length === 5) break;

    buttons.push(
      new ButtonBuilder()
        .setCustomId(searchString)
        .setLabel((buttons.length + 1).toString())
        .setStyle(ButtonStyle.Primary)
    );
  }

  const row: ActionRowBuilder<any> = new ActionRowBuilder().addComponents(...buttons);

  return row;
};

export { playerButtons, searchButtons };
