const { SlashCommandBuilder } = require("discord.js")
const { queueLists } = require("../utils/embed")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the player and disconnect."),
    async execute(interaction, player) {
        //await interaction.deferReply() //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }

        const queue = player.getQueue(interaction.guild)

        queue.destroy()

        return await interaction.reply({ content: "👋| Left VC" })
    }
}