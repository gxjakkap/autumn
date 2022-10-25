const { EmbedBuilder } = require("discord.js")
const { accentColor } = require("../../config.json")

exports.nowPlayingMessage = (trackName, sourceName, imgUrl, duration, requestedBy, url) => {
    let sourceType = "Author"

    // most of the times the song is posted on music lable's channel so it's not the artist name
    if (url.includes("youtu.be")){
        sourceType = "Channel"
    }

    let fields = [
        {name: "Track Name", value: trackName},
        {name: sourceType, value: sourceName},
    ]

    // spotify doesn't provide duration info
    if (duration!=="0:00") fields.push({name: "Duration", value: duration})

    fields.push({name: "Requested by", value: `<@${requestedBy}>`})
    const msg = new EmbedBuilder()
        .setColor(accentColor)
        .setTitle("Now Playing▶️🎶")
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
        fields.push({name: i.toString(), value: `${track.title} <@${track.requestedBy.id}>`})
        i++
    })

    let hasMore = false
    let hiddenAmount = 0

    if (fields.length > 10){
        hiddenAmount = fields.length - 10
        fields = fields.slice(0, 9)
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