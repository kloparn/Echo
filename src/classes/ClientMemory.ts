import { StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import queue from "../commands/queue";
import QueueObject from "../interfaces/queue-interface";

// Global object to keep track of where the bot currently is
// and what other memory related stuff.
export default class ClientMemory {
  private static instance: ClientMemory;
  public voiceChannel: VoiceChannel;
  public channel: TextChannel;
  public queue: Array<QueueObject>;
  public isConnectedToVoice: Boolean;
  public dispatcher: StreamDispatcher;
  public connection: VoiceConnection;
  public paused: Boolean;

  private constructor() {
    this.queue = [];
    this.isConnectedToVoice = false;
    this.paused = false;
  }

  public static getInstance(): ClientMemory {
    if (!ClientMemory.instance) ClientMemory.instance = new ClientMemory();

    return ClientMemory.instance;
  }
  public static wipeInstance() {
    const memory = ClientMemory.getInstance();
    memory.queue = [];
    memory.isConnectedToVoice = false;
    memory.paused = false;
    memory.dispatcher = null;
  }
}
