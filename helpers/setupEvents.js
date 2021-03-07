const playSound = require("./playSound");
const destroyClientConnection = require("./destroyCustomAttributes");

module.exports = (client) => {
    client.dispatcher.on('finish', async () => {
        if(client.queue.length > 0){
            const {str , endEvent} = client.queue.shift();
            client.dispatcher = await playSound(client, str);+
            endEvent(client); //required to setup a recall for the next song.
        } else {
            client.dispatcher.destroy();
            client.voiceChannelReference.leave();
            destroyClientConnection(client);
        }
    });
}