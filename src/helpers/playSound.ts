import ClientMemory from "../classes/ClientMemory";
import clientHandler from "./clientHandler";
import { QueueObject, VideoObject } from "../interfaces";
import { Readable } from "stream";
import { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from "yt-search";
import isValidUrl from "./isValidUrl";
import ytdl from "ytdl-core";
import { searchVideo } from "./searchVideo";
import { AudioPlayerStatus, createAudioResource, entersState, StreamType } from "@discordjs/voice";
import getValidVideoUrl from "./getValidVideoUrl";

const globalData = ClientMemory.getInstance();

const idleHandler = async () => {
  const song: QueueObject = clientHandler.getFromQueue();

  if (!song) {
    globalData.connection.disconnect();

    // we want the player to have a chance to disconnect from the voice channel before destroying the client.
    setTimeout(clientHandler.destroyClient, 0);
  } else {
    await globalData.playingInteraction.editReply(`Playing: ${song.title}\nLink: <${song.link}>`);
    try {
      await playSound(null, song);
    } catch (err) {
      console.log(err);
      await idleHandler();
    }
  }
};

export default async function playSound(searchTerm: string, queueSong?: QueueObject) {
  let youtubeReadable: Readable;
  let video: VideoSearchResult | LiveSearchResult | PlaylistSearchResult | ChannelSearchResult;

  if (queueSong) {
    youtubeReadable = ytdl(queueSong.link, { filter: "audioonly", highWaterMark: 1 << 25 });
  } else if (isValidUrl(searchTerm) && ytdl.validateURL(searchTerm)) {

    // we clean the searchTerm as it's a youtube link.
    searchTerm = getValidVideoUrl(searchTerm);

    youtubeReadable = ytdl(searchTerm, { filter: "audioonly", highWaterMark: 1 << 25 });
  } else {
    video = await searchVideo(searchTerm);
    youtubeReadable = ytdl(video.url, { filter: "audioonly", highWaterMark: 1 << 25 });
  }

  const resource = createAudioResource(youtubeReadable, {
    inputType: StreamType.WebmOpus,
  });

  globalData.player.play(resource);

  await entersState(globalData.player, AudioPlayerStatus.Playing, 5000);

  globalData.connection.subscribe(globalData.player);

  // we do not want to add multiple eventlisteners for "idle" status, so we do a simple check.

  if (globalData.idleHandlerStatus === "inactive") {
    globalData.idleHandlerStatus = "active";
    globalData.player.on(AudioPlayerStatus.Idle, idleHandler);
  }

  return { link: (video && video.url) || searchTerm, title: (video && video.title) || "You only gave me a link" };
}
