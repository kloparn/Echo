module.exports = (client) => {
    client.channelReference = null;
    client.voiceChannelReference = null;
    client.connection = null;
    client.dispatcher = null;
    client.queue = [];
}