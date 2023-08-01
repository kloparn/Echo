import { Client, CommandInteraction, Message } from "discord.js";
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { VideoSearchResult } from "yt-search";

// Global object to keep track of where the bot currently is
// and what other memory related stuff.
export default class ClientMemory {
  private static instance: ClientMemory;
  public queue: Array<VideoSearchResult>;
  public player: AudioPlayer;
  public currentVideo: VideoSearchResult;
  public connection: VoiceConnection;
  public client: Client;
  public playerEmbed: Message;
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
