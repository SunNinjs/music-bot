module.exports = {
  name: `shuffle`,
  names: [`shuf`, `random`],
  cooldown: 5,
  desc: `Shuffles the queue`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NoQueue(message, client))
    
    let queue = client.player.getQueue(message)
    
    if (queue.tracks.length <= 1) return message.channel.send(`**${client.allInfo.emojis.exclamation_question} No need to shuffle queue if there is only 1 song in queue**`)

    client.player.shuffle(message)
    return message.channel.send(`**Queue has been shuffled**`)
  }
}