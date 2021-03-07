const ytdl = require("ytdl-core-discord");
const search = require("youtube-search");

const options = {
    maxResults: 1,
    key: process.env["google-api-key"] || require("../config.json")["google-api-key"]
}

module.exports = async (client , url) => {
    console.log(`playing :${url}`)
    if(url.includes("https")) {
        //returns a dispatch object which can be controlled to pause and or fix a queue system. 
        dispatcher = client.connection.play(await ytdl(url), { type: 'opus'});
        return dispatcher;
    } else {
        //now we are searching for a video on youtube
        let youtubeSearchData;
        try {
            youtubeSearchData = await searchAsync(url);
        } catch (error) {
            return console.log("error: ", error);
        }   
        if(!youtubeSearchData[0]){
            client.channelReference.send("Didn't get a search result!");
            return;
        } 
        const {link, title} = youtubeSearchData[0];

        client.channelReference.send(`Playing : ${title}\nUrl: <${link}>`);
        
        return client.connection.play(await ytdl(link), { type: 'opus'});
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