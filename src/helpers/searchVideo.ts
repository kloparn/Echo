import { spawn } from "child_process";
import yts, { SearchResult, VideoSearchResult } from "yt-search";
import ytdl from "ytdl-core";
import getValidVideoUrl from "./getValidVideoUrl";
import isValidUrl from "./isValidUrl";

if (process.argv[2] === "searchVideoChild") {
  yts(process.argv[3]).then((response: SearchResult) => {
    const [video] = response.all.filter((it: any) => it.type === "video");

    ytdl.getBasicInfo(video.url).then(() => {
      console.log(JSON.stringify(video));
    });
  });
}

const searchVideo = async (searchTerm: string) => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);

  // as we want todo this without "pausing" the application we spawn a new child process then get the result

  const video: any = await new Promise((res, rej) => {
    const worker = spawn(process.execPath, [__filename, "searchVideoChild", searchTerm]);
    worker.stdout.on("data", (data) => {
      let video: VideoSearchResult = JSON.parse(data.toString());

      res(video);
    });

    worker.stderr.on("data", () => {
      rej("Video is restricted, cannot play");
    });
  });

  return video as VideoSearchResult;
};

export { searchVideo };
