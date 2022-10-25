const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the player."),
    async execute(interaction, player) {
        await interaction.deferReply({ephemeral: true}) //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }

        const queue = player.getQueue(interaction.guild)

        if (!queue.playing){
            return await interaction.editReply({ content: "Already paused!", ephemeral: true })
        }

        queue.setPaused(true)

        return await interaction.reply({ content: "⏸️| Player paused." })
    }
}