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
  const buttons = [
    new ButtonBuilder().setCustomId(searchResults[0]).setLabel("1").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(searchResults[1]).setLabel("2").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(searchResults[2]).setLabel("3").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(searchResults[3]).setLabel("4").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(searchResults[4]).setLabel("5").setStyle(ButtonStyle.Primary),
  ];

  const row: ActionRowBuilder<any> = new ActionRowBuilder().addComponents(...buttons);

  return row;
};

export { playerButtons, searchButtons };
