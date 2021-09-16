module.exports = {
  name: `replay`,
  cooldown: 5,
  desc: `Replays the current song`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (!message.guild.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(`**No Song playing**`)

    client.player.seek(message, 0);
    message.channel.send(`**${client.allInfo.emojis.headphones} Song has been replayed**`)
  }
}