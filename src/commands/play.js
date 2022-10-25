const { getSourceName, queueInitOption } = require("../utils/mini")

exports.run = (client, message, args, player) => {
    if (!message.member.voice.channelId) {
        return message.reply("🔇|You're not in a vc!")
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) {
        return message.reply("🔇|You're not in my voice channel!")
    }
    const query = args.join(" ");
    const queue = player.createQueue(message.guild, queueInitOption(message.channel))
    let initialTrack
    try {
        if (!queue.connection) {
            initialTrack = true
            queue.connect(message.member.voice.channel)
        }
    }
    catch (err) {
        queue.destroy()
        console.log(err)
        return message.reply("🔇|Could not join your voice channel!")
    }
    player.search(query, {requestedBy: message.author, searchEngine: "customExtractor"})
    .then(res => {
        if (!res || (!res.tracks || res.tracks.length<1)) return message.reply({ content: `❌ | Track **${query}** not found or not accessible!` })

        if (res.playlist){
            try {
                queue.addTracks(res.tracks)
                message.reply({ content: `📝 | Added **${res.tracks.length}** tracks from a ${getSourceName(res.playlist.source)} playlist **${res.playlist.title}** to queue!`, ephemeral: true })
            }
            catch (err) {
                throw err
            }
        }
        else {
            try{
                queue.addTrack(res.tracks[0])
                message.reply({ content: `📝 | Added track **${res.tracks[0].title}** to queue!`, ephemeral: true })
            }
            catch (err) {
                throw err
            }
        }

        if (initialTrack){
            queue.play()
        }
    })    
}

exports.name = "play"
exports.aliases = ["p"]
exports.desc = "Play a song!."