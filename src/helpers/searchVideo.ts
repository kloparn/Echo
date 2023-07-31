import { spawn } from "child_process";
import yts, { SearchResult } from "yt-search";
import { VideoObject } from "../interfaces";
import getValidVideoUrl from "./getValidVideoUrl";
import isValidUrl from "./isValidUrl";

if (process.argv[2] === "child") {
  yts(process.argv[3]).then((value) => {
    console.log(JSON.stringify(value));
  });
}

const searchVideo = async (searchTerm: string) => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);

  // as we want todo this without "pausing" the application we spawn a new child process then get the result

  const video: any = await new Promise((res, rej) => {
    const worker = spawn(process.execPath, [__filename, "child", searchTerm]);
    worker.stdout.on("data", (data) => {
      let response: SearchResult = JSON.parse(data.toString());

      const videos = response.all.filter((it: any) => it.type === "video");

      res(videos[0]);
    });
  });

  return { title: video.title, link: video.url} as VideoObject
};

export { searchVideo };
