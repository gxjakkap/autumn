exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    const queue = player.getQueue(message.guild)

    queue.skip()

    return message.reply("⏭️|Skipping track!")
}

exports.name = "skip"
exports.aliases = ["next", "sk"]
exports.desc = "Skip to the next track."