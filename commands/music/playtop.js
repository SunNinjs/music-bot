module.exports = {
  name: `playtop`,
  names: [`pt`, `ptop`],
  cooldown: 5,
  desc: `Adds a song to top of the queue`,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.channel.send(`You must input a song.`)
    }

    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))

    if (!client.player.getQueue(message)) {
      client.player.play(message, args.join(` `), true)
      return message.channel.send(`**${client.allInfo.emojis.headphones} Searching for \`${args.join(` `)}\`**`)
    }

    let queue = client.player.getQueue(message)
    await client.player.play(message, args.join(` `), true)
    let track = queue.tracks[queue.tracks.length-1]
    queue.tracks.splice(1, 0, track)
  }
}