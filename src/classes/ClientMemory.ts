import { Channel, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

export default class ClientMemory {
  private static instance: ClientMemory;
  public voiceChannel: VoiceChannel;
  public channel: TextChannel;
  public queue: string[];
  public voiceStatus: Boolean;
  public dispatcher: StreamDispatcher;
  public connection: VoiceConnection;

  private constructor() {
    this.queue = [];
    this.voiceStatus = false;
  }

  public static getInstance(): ClientMemory {
    if (!ClientMemory.instance) ClientMemory.instance = new ClientMemory();

    return ClientMemory.instance;
  }
  public static wipeInstance(){
    const memory = ClientMemory.getInstance();
    memory.queue = [];
    memory.voiceStatus = false;
  }
}
