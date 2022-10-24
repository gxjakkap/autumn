exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }
    const query = args.join(" ");
    const queue = player.createQueue(message.guild, {
        metadata: {
            channel: message.channel
        }
    })
    try {
        if (!queue.connection) queue.connect(message.member.voice.channel);
    }
    catch (err) {
        queue.destroy()
        console.log(err)
        return message.reply("Could not join your voice channel!")
    }
    player.search(query, {requestedBy: message.author})
    .then(x => {
        const track = x.tracks[0]
        if (!track){
            message.channel.send({ content: `❌ | Track **${query}** not found!` })
            return
        }
        queue.play(track)
        return message.channel.send(`📝 | Added track **${track.title}** to queue!`)
    })    
}

exports.name = "play"
exports.aliases = ["p"]
exports.desc = "Play a song!."