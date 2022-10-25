exports.getSourceName = (sourceType) => {
    switch (sourceType) {
        case "youtube-custom":
            return "Youtube"
        case "spotify-custom":
            return "Spotify"
        case "soundcloud-custom":
            return "Soundcloud"
        default:
            return sourceType
    }
}

exports.queueInitOption = (channel) => {
    return {
        metadata: {
            channel: channel
        },
        leaveOnEmpty: true,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000
    }
}