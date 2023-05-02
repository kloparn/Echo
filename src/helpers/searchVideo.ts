import yts from "yt-search";
import getValidVideoUrl from "./getValidVideoUrl";

const searchVideo = async (searchTerm: string) => {
  searchTerm = getValidVideoUrl(searchTerm);
  const response = await yts(searchTerm);

  const videos = response.all.filter((it: any) => it.type === "video");

  return videos[0];
};

export { searchVideo };
