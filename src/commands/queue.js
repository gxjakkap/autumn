const { queueLists } = require("../utils/embed")

exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    const queue = player.getQueue(message.guild)

    return message.reply({embeds: [queueLists(queue.tracks)]})
}

exports.name = "queue"
exports.aliases = ["q", "list"]
exports.desc = "Return play queue for this server."