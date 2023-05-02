import yts from "yt-search";
import getValidVideoUrl from "./getValidVideoUrl";
import isValidUrl from "./isValidUrl";

const searchVideo = async (searchTerm: string) => {
  if (isValidUrl(searchTerm)) searchTerm = getValidVideoUrl(searchTerm);
  const response = await yts(searchTerm);

  const videos = response.all.filter((it: any) => it.type === "video");

  return videos[0];
};

export { searchVideo };
