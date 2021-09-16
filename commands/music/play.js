const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

module.exports = {
  name: `play`,
  names: [`p`],
  cooldown: 5,
  desc: `Plays a song`,
  async execute(message, args, client) {

    if (!args[0]) {
      if (client.player.getQueue(message) && client.player.getQueue(message).paused && message.guild.me.voice.channel && message.guild.me.voice.channel.id === message.member.voice.channel.id) {
        client.player.resume(message)
        client.player.pause(message)
        client.player.resume(message)
  
        return message.channel.send(`Song has been resumed`)
      }
      return message.channel.send(`You must input a song.`)
    }
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))

    await client.player.play(message, args.join(` `), true)
    message.channel.send(`**${client.allInfo.emojis.headphones} Searching for \`${args.join(` `)}\`**`)
    await sleep(5000)
    client.player.setVolume(message, client.settings.defaultvolume)

  }
}