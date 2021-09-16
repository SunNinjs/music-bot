module.exports = {
  name: `clearqueue`,
  names: [`cl`, `clear`],
  cooldown: 5,
  desc: `Clears the queue`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NoQueue(message, client))
    
    client.player.clearQueue(message)
    message.channel.send(`**Queue has been cleared**`)
  }
}