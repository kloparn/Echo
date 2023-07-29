import yts, { SearchResult } from "yt-search";
import getValidVideoUrl from "./getValidVideoUrl";
import isValidUrl from "./isValidUrl";

const searchVideo = async (searchTerm: string) => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);

  let response: SearchResult;

  try {
    response = await yts(searchTerm);
  } catch (err) {
    console.log(err);
    return null;
  }
  
  
  const videos = response.all.filter((it: any) => it.type === "video");

  return videos[0];
};

export { searchVideo };
