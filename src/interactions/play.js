const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song!.")
        .addStringOption(options => options.setName('query').setDescription("Source to query.").setRequired(true)),
    async execute(interaction, player) {
        await interaction.deferReply() //reply with "bot is thinking..." interface
        if (!interaction.member.voice.channelId) {
            return await interaction.editReply({content: "You're not in a vc!", ephemeral: true})
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.editReply({ content: "You're not in my voice channel!", ephemeral: true })
        }
        const query = interaction.options.getString("query");
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        })
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        }
        catch (err) {
            queue.destroy();
            console.log(err)
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` })
        
        queue.play(track)

        return await interaction.followUp({ content: `📝 | Added track **${track.title}** to queue!`, ephemeral: true })
    }
}