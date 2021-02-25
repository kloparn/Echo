const ytdl = require("ytdl-core-discord");
const search = require("youtube-search");

const options = {
    maxResults: 1,
    key: require("../config.json")["google-api-key"]
}

module.exports = async (connection, url) => {
    if(url.includes("www.youtube.com")) {
         //returns a dispatch object which can be controlled to pause and or fix a queue system. 
        return connection.play(await ytdl(url), { type: 'opus'});
    } else {
        //now we are searching for a video on youtube
        let youtubeSearchData;
        try {
            youtubeSearchData = await searchAsync(url);
        } catch (error) {
            return console.log("error: ", error);
        }   
        const firstResult = youtubeSearchData[0];
        console.log("link: ", firstResult.link)

        return connection.play(await ytdl(firstResult.link), { type: 'opus'});
    }
}

const searchAsync = async (url) => {
    return new Promise((resolve, reject) => {
        search(url,options, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data)
            }
        });
    });
}