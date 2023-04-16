import yts from "yt-search";

const searchVideo = async (searchTerm: string) => {
  const response = await yts(searchTerm);

  const videos = response.all.filter((it: any) => it.type === "video");

  return videos[0];
};

export { searchVideo };
