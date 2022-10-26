const { currentlyPlaying } = require("../utils/embed")

exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    const queue = player.getQueue(message.guild)
    const nowPlaying = queue.nowPlaying()
    if (!nowPlaying){
        return message.reply({ content: `❌ | There's no track playing.` })
    }
    return message.reply({embeds: [currentlyPlaying(nowPlaying, queue.createProgressBar())]})
}

exports.name = "nowplaying"
exports.aliases = ["np", "current"]
exports.desc = "Return track currently playing."