const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip to next song in queue."),
    async execute(interaction, player) {
        await interaction.deferReply() //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }

        const queue = player.getQueue(interaction.guild)

        queue.skip()

        return await interaction.followUp({ content: `⏭️|Skipping track!` })
    }
}