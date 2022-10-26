const { SlashCommandBuilder } = require("discord.js")
const { currentlyPlaying } = require("../utils/embed")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Return track currently playing."),
    async execute(interaction, player) {
        //await interaction.deferReply() //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }

        const queue = player.getQueue(interaction.guild)

        const nowPlaying = queue.nowPlaying()
        if (!nowPlaying){
            return await interaction.reply({ content: `❌ | There's no track playing.` })
        }

        return await interaction.reply({embeds: [currentlyPlaying(nowPlaying, queue.createProgressBar())]})
    }
}