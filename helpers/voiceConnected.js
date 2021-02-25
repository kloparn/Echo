module.exports = (client, user) => {
    const guild = client.guilds.cache.get('75669114667937792');
    const member = guild.member(user);
    return !!member.voice.channel;
}