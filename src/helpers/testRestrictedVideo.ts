import { spawn } from "child_process";
import ytdl from "ytdl-core";
import { VideoObject } from "../interfaces";

if (process.argv[2] === "checkVideoChild") {
  ytdl.getInfo(JSON.parse(process.argv[3])).then((value) => {
    console.log(value);
  });
}

// as there is a bug with the player that is used, if the video is somehow "restricted"
// the entire application will crash, in-order to avoid that we test getting the video information
// in a different process all together then return the result if it can be played.

const testRestrictedVideo = async (video: VideoObject) => {
  const canPlayVideo = await new Promise((res, rej) => {
    const worker = spawn(process.execPath, [__filename, "checkVideoChild", JSON.stringify(video.link)]);

    worker.stdout.on("data", (data) => {
      res(true);
    });

    worker.stderr.on("data", (data) => {
      rej(false);
    });
  });

  return canPlayVideo;
};

export { testRestrictedVideo };
