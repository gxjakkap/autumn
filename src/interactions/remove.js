const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove specified track from the queue."),
    async execute(interaction, player) {
        await interaction.deferReply() //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }

        if (args.length !== 1){
            return await interaction.editReply("❌| Invalid Argument! Try with track position (number).")
        }
    
        let trackPos
    
        try{
            trackPos = parseInt(args[0]) - 1
        }
        catch {
            return await interaction.editReply("❌| Invalid Argument! Try with track position (number).")
        }

        const queue = player.getQueue(interaction.guild)
        const removed = queue.remove(trackPos)

        if (!removed){
            return await interaction.editReply(`❌| Track at position **${(trackPos + 1).toString()}** doesn't exist!`)
        }

        queue.skip()

        return await interaction.followUp({ content: `🗑️| Removed **${removed.title}** from the queue!` })
    }
}