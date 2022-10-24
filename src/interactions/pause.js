const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

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

        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Resume')
					.setStyle(ButtonStyle.Primary),
			);

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', i => {
            if (!queue.playing){
                i.followUp({ content: "Already playing!", ephemeral: true })
                return
            }
            queue.setPaused(false)
            i.update({content: "⏯️| Player resumed.", components: []})
        });

        return await interaction.reply({ content: "⏸️| Player paused.", components: [row]  })
    }
}