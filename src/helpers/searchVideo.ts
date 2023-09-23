import { spawn } from "child_process";
import yts, { PlaylistItem, SearchResult, VideoSearchResult } from "yt-search";
import ytdl from "ytdl-core";
import getValidVideoUrl from "./getValidVideoUrl";
import isValidUrl from "./isValidUrl";

if (process.argv[2] === "searchVideoChild") {
  yts(process.argv[3]).then((response: SearchResult) => {
    const [video] = response.all.filter((it: VideoSearchResult) => it.type === "video");

    ytdl.getBasicInfo(video.url).then(() => {
      console.log(JSON.stringify(video));
    });
  });
}

if (process.argv[2] === "multipleSearch") {
  yts(process.argv[3]).then((response: SearchResult) => {
    const videos = response.all.filter((it: VideoSearchResult) => it.type === "video");

    console.log(JSON.stringify(videos));
  });
}

const searchVideo = async (searchTerm: string) => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);

  // as we want todo this without "pausing" the application we spawn a new child process then get the result

  const video: VideoSearchResult = await new Promise((res, rej) => {
    const worker = spawn(process.execPath, [__filename, "searchVideoChild", searchTerm]);
    worker.stdout.on("data", (data) => {
      const video: VideoSearchResult = JSON.parse(data.toString());

      res(video);
    });

    worker.stderr.on("data", () => {
      rej("Video is restricted, cannot play");
    });
  });

  return video;
};

const searchForMultiple = async (searchTerm: string): Promise<VideoSearchResult[]> => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);

  const videos: VideoSearchResult[] = await new Promise((res, rej) => {
    const worker = spawn(process.execPath, [__filename, "multipleSearch", searchTerm]);

    worker.stdout.on("data", (data) => {
      const videos: VideoSearchResult[] = JSON.parse(data.toString());

      res(videos);
    });
  });

  return videos as VideoSearchResult[];
};

const getPlaylistVideos = async (playlistUrl: string): Promise<PlaylistItem[]> => {
  if (!isValidUrl(playlistUrl) && !playlistUrl.includes("list=")) throw new Error("Did not retrieve a youtube playlist url!");

  const plistUrl = new URL(playlistUrl);

  const playlist = await yts.search({ listId: plistUrl.searchParams.get("list")});

  return playlist.videos;
};

export { searchVideo, searchForMultiple, getPlaylistVideos };
