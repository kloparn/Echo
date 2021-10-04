import { StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

// Global object to keep track of where the bot currently is
// and what other memory related stuff.
export default class ClientMemory {
  private static instance: ClientMemory;
  public voiceChannel: VoiceChannel;
  public channel: TextChannel;
  public queue: string[];
  public isConnectedToVoice: Boolean;
  public dispatcher: StreamDispatcher;
  public connection: VoiceConnection;

  private constructor() {
    this.queue = [];
    this.isConnectedToVoice = false;
  }

  public static getInstance(): ClientMemory {
    if (!ClientMemory.instance) ClientMemory.instance = new ClientMemory();

    return ClientMemory.instance;
  }
  public static wipeInstance(){
    const memory = ClientMemory.getInstance();
    memory.queue = [];
    memory.isConnectedToVoice = false;
    memory.dispatcher = null;
  }
}
