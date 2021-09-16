module.exports = {
  name: `resume`,
  names: [`re`, `res`, `continue`],
  cooldown: 5,
  desc: `Resumes any current song.`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (!message.guild.me.voice.channel) return message.channel.send(`Bot In Not Voice Channel`)
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (client.player.getQueue(message) && client.player.getQueue(message).paused) {
      client.player.resume(message)
      client.player.pause(message)
      client.player.resume(message)

      return message.channel.send(`Song has been resumed`)
    }
  }
}