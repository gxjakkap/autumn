exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    const queue = player.getQueue(message.guild)

    if (!queue.playing){
        return message.reply({ content: "Already paused!", ephemeral: true })
    }

    queue.setPaused(true)

    return message.reply({ content: "⏸️| Player paused." })
}

exports.name = "pause"
exports.aliases = null
exports.desc = "Pause the player."