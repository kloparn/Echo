import search from "youtube-search";

export const multipleSearch = async (url: string, maxResults: number) => {
  const options = {
    maxResults,
    key: process.env.GOOGLE_KEY,
  };

  const youtubeSearchData: any = await searchAsync(url, options);

  if (!youtubeSearchData[0]) {
    return [];
  }

  return youtubeSearchData;
};

const searchAsync = async (url: string, options: object) => {
  return new Promise((resolve, reject) => {
    search(url, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
