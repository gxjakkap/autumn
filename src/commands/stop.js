exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    const queue = player.getQueue(message.guild)

    queue.destroy()

    return message.reply("👋| Left VC")
}

exports.name = "stop"
exports.aliases = ["disconnect", "dc"]
exports.desc = "Stop the player and disconnect."