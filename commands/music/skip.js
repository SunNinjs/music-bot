const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

module.exports = {
  name: `skip`,
  aliases: [`forceskip`, `sk`, `fs`],
  cooldown: 5,
  desc: `Skips a song`,
  async execute(message, args, client) {

    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(`No songs in queue`)
    const queue = client.player.getQueue(message)
    if (!args[0]) {
      client.player.skip(message)
      return message.channel.send(`**Song has been skipped**`)
    } else {
      const number = Number.parseInt(args[0])
      if (number == undefined) return message.channel.send(client.musicFunc.NoQueue(message, client))
      let howmany = number-1;
      queue.tracks.splice(1, howmany)
      client.player.skip(message)
      return message.channel.send(`**Song has been skipped**`)
    }
  }
}