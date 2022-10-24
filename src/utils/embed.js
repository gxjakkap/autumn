const { EmbedBuilder } = require("discord.js")
const { accentColor } = require("../../config.json")

exports.nowPlayingMessage = (trackName, sourceName, imgUrl, duration) => {
    const fields = [
        {name: "Track Name", value: trackName},
        {name: "Author / Source", value: sourceName},
        {name: "Duration", value: duration},
    ]
    const msg = new EmbedBuilder()
        .setColor(accentColor)
        .setTitle("Now Playing")
        .setImage(imgUrl)
        .addFields(fields)
    return msg
}

exports.queueLists = (queue) => {
    if (!queue || queue.length === 0){
        const msg = new EmbedBuilder()
            .setColor(accentColor)
            .setTitle("Tracks in queue")
            .addFields([{name: "Queue's empty", value: "🫙"}])
        return msg
    }

    let fields = []
    let i = 1
    queue.forEach(track => {
        fields.push({name: i.toString(), value: track.title})
        i++
        console.log(queue[i-1])
    })

    console.log(fields)
    const msg = new EmbedBuilder()
        .setColor(accentColor)
        .setTitle("Tracks in queue")
        .addFields(fields)
    return msg
}