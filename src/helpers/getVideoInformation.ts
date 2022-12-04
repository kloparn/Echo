import search, { YouTubeSearchResults, YouTubeSearchPageResults, YouTubeSearchOptions } from "youtube-search";
import { VideoObject } from "../interfaces";
import sendMessage from "./sendMessage";

const opts: YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.GOOGLE_KEY,
};

export default async (uri: string): Promise<VideoObject | null> => {
  const videos: YouTubeSearchResults[] = (await trySearch(uri, "Could not find any video...")).results;

  if (!videos || !videos[0]) return null;

  for (const video of videos) {
    if (video.link.includes("playlist")) continue;

    return { link: video.link, title: video.title };
  }

  return null;
};

const trySearch = async (
  find: string,
  errMsg: string
): Promise<{ results: YouTubeSearchResults[]; pageInfo: YouTubeSearchPageResults }> => {
  try {
    return await search(find, opts);
  } catch (e) {
    await sendMessage(errMsg);
    return null;
  }
};
