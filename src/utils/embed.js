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
    })

    let hasMore = false
    let hiddenAmount = 0

    if (fields.length > 25){
        hiddenAmount = fields.length - 25
        fields = fields.slice(0, 24)
        hasMore = true
    }
        

    console.log(fields)
    const msg = new EmbedBuilder()
        .setColor(accentColor)
        .setTitle("Tracks in queue")
        .addFields(fields)

    if (hasMore){
        msg.setFooter({text: `and ${hiddenAmount} more...`})
    }    

    return msg
}