import ClientMemory from "../classes/ClientMemory";
import clientHandler from "./clientHandler";
import { QueueObject, VideoObject } from "../interfaces";
import { Readable } from "stream";
import { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from "yt-search";
import isValidUrl from "./isValidUrl";
import ytdl from "ytdl-core";
import { searchVideo } from "./searchVideo";
import { AudioPlayerStatus, createAudioResource, entersState, StreamType } from "@discordjs/voice";

const globalData = ClientMemory.getInstance();

const idleHandler = () => {
  const song: QueueObject = clientHandler.getFromQueue();

  if (!song) {
    globalData.connection.disconnect();

    setTimeout(clientHandler.destroyClient, 0);
  } else {
    globalData.playingInteraction.editReply(`Playing: ${song.title}\nLink: <${song.link}>`);
    playSound(null, song);
  }
};

export default async function playSound(searchTerm: string, queueSong?: QueueObject) {
  let youtubeReadable: Readable;
  let video: VideoSearchResult | LiveSearchResult | PlaylistSearchResult | ChannelSearchResult;

  if (!queueSong && isValidUrl(searchTerm)) youtubeReadable = ytdl(searchTerm, { filter: "audioonly", highWaterMark: 1 << 25 });
  else {
    if (!queueSong) video = await searchVideo(searchTerm);

    if (queueSong) {
      youtubeReadable = ytdl(queueSong.link, { filter: "audioonly", highWaterMark: 1 << 25 });
    } else {
      youtubeReadable = ytdl(video.url, { filter: "audioonly", highWaterMark: 1 << 25 });
    }
  }

  const resource = createAudioResource(youtubeReadable, {
    inputType: StreamType.WebmOpus,
  });

  globalData.player.play(resource);

  entersState(globalData.player, AudioPlayerStatus.Playing, 5000);

  globalData.connection.subscribe(globalData.player);

  globalData.player.on(AudioPlayerStatus.Idle, idleHandler);

  console.log(video);

  return { link: (video && video.url) || searchTerm, title: (video && video.title) || "You only gave me a link" };
}
