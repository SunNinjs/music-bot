const { MessageEmbed } = require("discord.js")

module.exports = {
  name: `nowplaying`,
  names: [`np`],
  cooldown: 5,
  desc: `Shows what song the bot is playing`,
  async execute(message, args, client) {
    if (!message.guild.me.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(`We are not in the same Voice Channel`)
    if (!client.player.isPlaying(message)) return message.channel.send(client.musicFunc.NothingPlaying(message, client))

    let track = client.player.nowPlaying(message);

    let timecode = client.player.getTimeCode(message)
    let ms = client.mainFunc.Turn_in_to_MS(timecode.current)

    let progressBar = client.mainFunc.progressBar(track.durationMS, ms);

    const trackEmbed = new MessageEmbed()
      .setColor(client.allInfo.color)
      .setFooter(client.allInfo.footer)
      .setTimestamp()
      .setAuthor(`Now Playing ♪`, message.author.avatarURL({dynamic: true}))
      .setThumbnail(track.thumbnail)
      .setDescription(`[${track.title}](${track.url})\n\n\`${progressBar.string}\`\n\n\`${client.player.getTimeCode(message).current} / ${track.duration}\` ${progressBar.percentage}%\n\n\`Requested By\` ${message.member.displayName} (${message.author.tag})`);

    message.channel.send(trackEmbed)
  }
}