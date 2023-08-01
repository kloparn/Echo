import ClientMemory from "../classes/ClientMemory";
import clientHandler from "./clientHandler";
import isValidUrl from "./isValidUrl";
import ytdl from "ytdl-core";
import { searchVideo } from "./searchVideo";
import { AudioPlayerStatus, AudioResource, createAudioResource } from "@discordjs/voice";
import getValidVideoUrl from "./getValidVideoUrl";
import { VideoSearchResult } from "yt-search";
import buildEmbed from "./buildEmbed";

const globalData = ClientMemory.getInstance();

const getVideo = async (link) => {
  if (isValidUrl(link) && ytdl.validateURL(link)) {
    link = getValidVideoUrl(link);
  }

  const video = await searchVideo(link);

  return video;
};

const getYoutubeReadable = (link: string) => {
  return ytdl(link, { filter: "audioonly", highWaterMark: 1 << 25 });
};

const idleHandler = async () => {
  const song = clientHandler.getFromQueue();

  if (!song) {
    await globalData.playerEmbed.delete();
    globalData.connection.disconnect();

    // we want the player to have a chance to disconnect from the voice channel before destroying the client.
    setTimeout(clientHandler.destroyClient, 0);
  } else {
    try {
      const youtubeReadable = getYoutubeReadable(song.url);
      const resource = createAudioResource(youtubeReadable);
      const video = await playAudio(song, resource);
      globalData.currentVideo = video;
      await globalData.playerEmbed.edit({ embeds: [buildEmbed(video, globalData.queue)] });
    } catch (err) {
      setTimeout(async () => {
        if (globalData?.connection?.disconnect) {
          await idleHandler();
        }
      }, 200);
    }
  }
};

const playAudio = async (video: VideoSearchResult, resource: AudioResource<null>) => {
  try {
    globalData.player.play(resource);
    globalData.connection.subscribe(globalData.player);
  } catch (e) {
    throw new Error("Could not play the song as the player would not subscribe");
  }

  return video;
};

export default async function playSound(searchTerm: string) {
  const video = await getVideo(searchTerm);
  const youtubeReadable = getYoutubeReadable(video.url);

  const resource = createAudioResource(youtubeReadable);

  // we do not want to add multiple eventlisteners for "idle" status, so we do a simple check.

  if (globalData.idleHandlerStatus === "inactive") {
    globalData.idleHandlerStatus = "active";
    globalData.player.on(AudioPlayerStatus.Idle, idleHandler);
  }

  return await playAudio(video, resource);
}
