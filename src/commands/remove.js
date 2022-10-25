exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("You're not in my voice channel!")
    }

    if (args.length !== 1){
        return message.reply("❌| Invalid Argument! Try with track position (number).")
    }

    let trackPos

    try{
        trackPos = parseInt(args[0]) - 1
    }
    catch {
        return message.reply("❌| Invalid Argument! Try with track position (number).")
    }
    
    const queue = player.getQueue(message.guild)
    const removed = queue.remove(trackPos)

    if (!removed){
        return message.reply(`❌| Track at position **${(trackPos + 1).toString()}** doesn't exist!`)
    }

    return message.reply(`🗑️| Removed **${removed.title}** from the queue!`)
}

exports.name = "remove"
exports.aliases = ["rm", "del"]
exports.desc = "Remove specified track from the queue."