import ClientMemory from "../classes/ClientMemory";
import clientHandler from "./clientHandler";
import { QueueObject, VideoObject } from "../interfaces";
import isValidUrl from "./isValidUrl";
import ytdl from "ytdl-core";
import { searchVideo } from "./searchVideo";
import { AudioPlayerStatus, AudioResource, createAudioResource } from "@discordjs/voice";
import getValidVideoUrl from "./getValidVideoUrl";

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
  const song: QueueObject = clientHandler.getFromQueue();

  if (!song) {
    globalData.connection.disconnect();

    // we want the player to have a chance to disconnect from the voice channel before destroying the client.
    setTimeout(clientHandler.destroyClient, 0);
  } else {
    try {
      const youtubeReadable = getYoutubeReadable(song.link);
      const resource = createAudioResource(youtubeReadable);
      const interactionReplyString = await playAudio({ link: song.link, title: song.title }, resource);
      await globalData.playingInteraction.editReply(interactionReplyString);
    } catch (err) {
      console.log(err);
      await globalData.playingInteraction.editReply("Something wrong with the next song");
      setTimeout(async () => {
        if (globalData?.connection?.disconnect) {
          await idleHandler();
        }
      }, 200);
    }
  }
};

const playAudio = async (video: VideoObject, resource: AudioResource<null>) => {
  try {
    globalData.player.play(resource);
    globalData.connection.subscribe(globalData.player);
  } catch (e) {
    console.log(e);
    await globalData.playingInteraction.reply(`Could not play: ${video.title || "__no title given__"} `);
    throw new Error("Could not play the song as the player would not subscribe");
  }

  return `Playing: ${video && video.title}\nLink: <${(video && video.link) || "No link specified"}>`;
};

export default async function playSound(searchTerm: string) {
  const video = await getVideo(searchTerm);
  const youtubeReadable = getYoutubeReadable(video.link);

  const resource = createAudioResource(youtubeReadable);

  // we do not want to add multiple eventlisteners for "idle" status, so we do a simple check.

  if (globalData.idleHandlerStatus === "inactive") {
    globalData.idleHandlerStatus = "active";
    globalData.player.on(AudioPlayerStatus.Idle, idleHandler);
  }

  return await playAudio(video, resource);
}
