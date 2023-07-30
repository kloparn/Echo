import ClientMemory from "../classes/ClientMemory";
import clientHandler from "./clientHandler";
import { QueueObject, VideoObject } from "../interfaces";
import { Readable } from "stream";
import { ChannelSearchResult, LiveSearchResult, PlaylistSearchResult, VideoSearchResult } from "yt-search";
import isValidUrl from "./isValidUrl";
import ytdl from "ytdl-core";
import { searchVideo } from "./searchVideo";
import { AudioPlayerStatus, createAudioResource, PlayerSubscription } from "@discordjs/voice";
import getValidVideoUrl from "./getValidVideoUrl";

const globalData = ClientMemory.getInstance();
let createdSubscription: PlayerSubscription;

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
      await globalData.playingInteraction.editReply(`Something happened to the song: ${song.title}`);
      setTimeout(async () => {
        if (globalData?.connection?.disconnect) {
          await idleHandler();
        }
      }, 200);
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

  const resource = createAudioResource(youtubeReadable);

  // we do not want to add multiple eventlisteners for "idle" status, so we do a simple check.

  if (globalData.idleHandlerStatus === "inactive") {
    globalData.idleHandlerStatus = "active";
    globalData.player.on(AudioPlayerStatus.Idle, idleHandler);
  }

  // Something is wrong with trying to play the audio if the video does not have a webm result!

  try {
    globalData.player.play(resource);
    globalData.connection.subscribe(globalData.player);
  } catch (e) {
    console.log(e);
    await idleHandler();
    await globalData.playingInteraction.reply(`Could not play: ${video.title || "__no title given__"} `);
  }

  return { link: (video && video.url) || searchTerm, title: (video && video.title) || "You only gave me a link" };
}
