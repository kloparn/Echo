import { Client, CommandInteraction } from "discord.js";
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import QueueObject from "../interfaces/queue-interface";

// Global object to keep track of where the bot currently is
// and what other memory related stuff.
export default class ClientMemory {
  private static instance: ClientMemory;
  public queue: Array<QueueObject>;
  public player: AudioPlayer;
  public currentVideo: QueueObject;
  public connection: VoiceConnection;
  public client: Client;
  public playingInteraction: CommandInteraction;
  public idleHandlerStatus: String;

  private constructor() {
    this.queue = [];
    this.client = null;
    this.player = new AudioPlayer();
    this.idleHandlerStatus = "inactive";
  }

  public static getInstance(): ClientMemory {
    if (!ClientMemory.instance) ClientMemory.instance = new ClientMemory();

    return ClientMemory.instance;
  }
  public static wipeInstance() {
    const memory = ClientMemory.getInstance();
    memory.queue = [];
    memory.currentVideo = null;
    memory.player = new AudioPlayer();
    memory.connection = null;
    memory.idleHandlerStatus = "inactive";
  }

  public static setClient(client: Client) {
    const memory = ClientMemory.getInstance();
    memory.client = client;
  }
}
