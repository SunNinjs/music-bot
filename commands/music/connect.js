module.exports = {
  name: `connect`,
  names: [`summon`, `join`],
  cooldown: 5,
  desc: `Summons the bot to join the channel`,
  async execute(message, args, client) {
    if (message.guild.me.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))

    let voiceChannel = message.member.voice.channel;
    voiceChannel.join();
    message.channel.send(`**${client.allInfo.emojis.headphones} Joined Voice Channel \`${voiceChannel.name}\`!**`)
  }
}