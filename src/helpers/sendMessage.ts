import { Message } from "discord.js";
import ClientMemory from "../classes/ClientMemory";

const globalData = ClientMemory.getInstance();

export default async (msg: string): Promise<Message> => await globalData.channel.send(msg);
