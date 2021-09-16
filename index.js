const { Client, MessageEmbed, Collection, Intents } = require(`discord.js`)
const { Player } = require(`discord-player`)
const mongoose = require(`mongoose`)
const fs = require(`fs`)
const intents = new Intents(32767)
const client = new Client({ intents: intents });
const Settings = require(`./schemas/settings.js`)
require('discord-buttons')(client)
require(`dotenv`).config();
require(`./utils/functions.js`).Addons(client);

client.on(`ready`, async () => {
  client.user.setPresence({
    activity: {
      name: `In Domain Expansion`,
      type: `PLAYING`
    }
  })
  console.log(`Logged into ${client.user.tag}\nBot Invite: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
  mongoose.connect(process.env.MONGO_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => console.log(`Mongoose Connection Established`))
})

const player = new Player(client, {
  leaveOnEnd: true,
  leaveOnEndCooldown: 30000,
  leaveOnStop: false,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 5000,
});
client.player = player;

client.commands = new Collection();
client.aliases = new Collection();
fs.readdirSync('C:\\Users\\Sun\\Desktop\\Other\\Coding\\Javascript\\Discord Bots\\music-bot\\commands').forEach(dir => {
  const commands = fs.readdirSync(`C:\\Users\\Sun\\Desktop\\Other\\Coding\\Javascript\\Discord Bots\\music-bot\\commands/${dir}`).filter(file => file.endsWith(".js"))
  for (let file of commands) {
    let command = require(`./commands/${dir}/${file}`)
    const name = command?.name
    if (!name) {if (!command?.names) name = file; name = command.names[0]}
    client.commands.set(name, command)
    if (command.aliases) {command.aliases.forEach(alias => { client.aliases.set(alias, command.name) })}
  }
})
client.cooldowns = new Collection();
client.on(`message`, async message => {
  if (message.author.bot) return;
  let settings = await Settings.find({GuildID: message.guild.id})
  if (settings[0] == undefined) {
    await new Settings({
      dev: `221403951700901888`,
      GuildID: message.guild.id,
      prefix: process.env.PREFIX,
      blacklist: [],
      djrole: [],
      djonly: false,
      defaultvolume: 100
    }).save()
    settings = {
      dev: `221403951700901888`,
      prefix: process.env.PREFIX,
      blacklist: [],
      djrole: [],
      djonly: false,
      defaultvolume: 100
    }
  } else {
    settings = settings[0]
  }
  client.settings = settings;

  if (!message.content.startsWith(settings.prefix)) return;
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (settings.blacklist.includes(message.channel.id)) return;

  let color = message.guild.me.displayHexColor;
  color !== `#000000` ? client.allInfo.color = color : client.allInfo.color = `#36393F`

  if (settings.djonly) {
    if (!settings.djrole.some(role => message.member.roles.cache.has(role))) return;
  }

  const command = client.commands.get(commandName) || client.commands.find(cmd => (cmd.names && cmd.names.includes(commandName)) || (cmd.aliases && cmd.aliases.includes(commandName)))
  if (!command) return;
  if (command.guildOnly && message.channel.type === `dm`) {
    return message.channel.send(`This command is not accessible in dms`)
  }
  if (command.dmOnly && message.channel.type !== `dm`) {
    return message.channel.send(`This command is only accessible in dms`)
  }

  if ((command.permissions || command.perms) && message.author.id !== client.settings.dev) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions || command.perms)) {
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    }
  }

  if (command.roles && command.guildOnly && message.author.id !== client.settings.dev) {
    const member = message.member
    const guild = command.roles.filter(arr => arr.guild === message.guild.id || arr.guild === message.guild.name || arr.guild === message.guild.nameAcronym)
    if (!guild[0] && !command.defaultperms) return message.channel.send( `You do not have permissions to run ${commandName}`)
    if (guild[0]) {
      if (!member.roles.cache.some(role => guild[0].roles.includes(role.name) || guild[0].roles.includes(role.id)))
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    } else if (command.defaultperms) {
      if (!member.roles.cache.some(role => command.defaultperms.includes(role.name) || command.defaultperms.includes(role.id)))
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    }
  }

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${settings.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection())
  }

	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || command.time || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
    if (command.execute) {
      command.execute(message, args, client);
    } else if (command.run) {
      command.run(message, args, client)
    }
	} catch (error) {
		console.error(error);
		message.channel.send('there was an error trying to execute that command!');
	}
})

client.player.on(`trackAdd`, (message, queue, track) => {
  let totalMS = 0;
  queue.tracks.forEach(track => totalMS += track.durationMS)

  const TrackAdd = new MessageEmbed()
    .setColor(client.allInfo.color)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(`${track.author} - ${track.title}`)
    .setURL(track.url)
    .setAuthor(`Added to Queue`, message.author.avatarURL({dynamic: true}))
    .setThumbnail(track.thumbnail)
    .addField(`Duration`, track.duration, true)
    .addField(`Estimated Time Before Playing`, client.mainFunc.MinutesAndSeconds(totalMS), true)
    .addField(`Position In Queue`, queue.tracks.length, true);

  message.channel.send(TrackAdd)
})

client.player.on(`playlistAdd`, (message, queue, playlist) => {

  const PlaylistAdd = new MessageEmbed()
    .setColor(playlist.dominantColor)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(playlist.title)
    .setAuthor(`Playlist added to queue`, message.author.avatarURL({dynamic: true}))
    .setThumbnail(playlist.thumbnail)
    .addField(`Duration`, client.mainFunc.MinutesAndSeconds(playlist.duration), true)
    .addField(`Enqueued`, playlist.tracks.length, true);
  
  message.channel.send(PlaylistAdd)
})

client.player.on(`queueCreate`, (message, queue) => {

  let track = queue.tracks[0]

  const TrackAdd = new MessageEmbed()
    .setColor(client.allInfo.color)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(`${track.author} - ${track.title}`)
    .setURL(track.url)
    .setAuthor(`Added to Queue`, message.author.avatarURL({dynamic: true}))
    .setThumbnail(track.thumbnail)
    .addField(`Duration`, track.duration, true)
    .addField(`Estimated Time Before Playing`, `0`, true)
    .addField(`Position In Queue`, queue.tracks.length, true);

  message.channel.send(TrackAdd)
})

client.login(process.env.DISCORD_TOKEN)