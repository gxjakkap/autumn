const { Client, Events, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const { Player } = require("discord-player")
const { token, clientId, prefix } = require('../config.json');
/* const pathToFfmpeg = require('ffmpeg-static') */
const fs = require("fs")
const extractor = require("./utils/extractor")
const { nowPlayingMessage } = require("./utils/embed")

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
	],
});

const player = new Player(client, {
    ytdlDownloadOptions: {
        filter: "audioonly",
        quality: "highestaudio"
    }
})

player.use("customExtractor", extractor)


// TODO: proper error handling
player.on("error", (queue, err) => {
    console.log(err)
})
player.on("connectionError", (queue, err) => {
    console.log(err)
})

player.on("trackStart", (queue, track) => {
    queue.metadata.channel.send({embeds: [nowPlayingMessage(track.title, track.author, track.thumbnail, track.duration, track.requestedBy.id, track.url)]})
})


// update presence and log bot's discord tag on ready
client.once(Events.ClientReady, c => {
	client.user.setPresence({
		activities: [{name: "music🎶🎵", type: ActivityType.Playing}], //for activity type, see https://discord-api-types.dev/api/discord-api-types-v9/enum/ActivityType
		status: 'available'
	});
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//message commands collection
client.commands = new Collection()
client.aliases = new Collection()
const commands = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"))
for (const file of commands) {
    const commandName = file.split(".")[0]
    const command = require(`./commands/${file}`)
    console.log(`Attempting to load command ${commandName}`)
	if (command.aliases){
		command.aliases.forEach(alias => {
			client.aliases.set(alias, commandName)
		})
	}
    client.commands.set(commandName, command)
}

//message commands handler
client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return;
    if (message.content.indexOf(prefix) !== 0) return;

	if (message.mentions.has(client.user.id) && message.type !== 'REPLY') {
        message.reply(`My prefix is "${prefix}". Try running ${prefix}help for a list of command.`)
    }

    console.log(`[${message.guild}] ${message.author.tag}: ${message.content}`)

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

	// check for aliases
	const aliasCommand = client.aliases.get(command)
	if (aliasCommand){
		const rcmd = client.commands.get(aliasCommand)
		rcmd.run(client, message, args, player)
		return
	}

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args, player)
})

//interaction commands collection
const interactions = []
const interactionFiles = fs.readdirSync('./src/interactions').filter(file => file.endsWith('.js'));
client.interactions = new Collection();
for (const file of interactionFiles) {
    const command = require(`./interactions/${file}`);
    interactions.push(command.data.toJSON());
    client.interactions.set(command.data.name, command);
}

//register interaction commands
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${interactions.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: interactions },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

//interaction commands handler
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.interactions.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, player);
	} catch (error) {
		console.log(error);
		await interaction.channel.send({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



client.login(token);