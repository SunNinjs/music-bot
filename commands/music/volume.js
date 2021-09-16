module.exports = {
  name: `volume`,
  names: [`vol`],
  cooldown: 5,
  desc: `Sets the volume of the bot`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (!message.guild.me.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NoQueue(message, client))

    if (!args[0]) return message.channel.send(client.musicFunc.NoArgument(message, client))
    if (Number.parseInt(args[0]) == NaN) return message.channel.send(client.musicFunc.NoArgument(message, client))
    let number = Number.parseInt(args[0])

    if (number == 0 || number > 500) return message.channel.send(`**${client.allInfo.emojis.X} You cannot set the volume higher then 500 or lower then 0**`)

    client.player.setVolume(message, number)

    return message.channel.send(`**${client.allInfo.emojis.headphones} Volume has been set to \`${args[0]}%\`**`)
  }
}