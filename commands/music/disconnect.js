module.exports = {
  name: `disconnect`,
  cooldown: 5,
  desc: `Disconnects the bot`,
  async execute(message, args, client) {
    if (!message.guild.me.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(`We are not in the same Voice Channel`)

    message.guild.me.voice.channel.leave();
    message.channel.send(`Left the voice channel`)
  }
}