function Turn_in_to_MS(current) {
  let splitted = current.split(`:`)
  time = 0;

  for (i=0;i<splitted.length;i++) {
    if (Number.parseInt(splitted[i]) == NaN) return undefined
  }

  if (splitted.length == 4) {
    time += splitted[0] * 24 * 60 * 60 * 1000
    time += splitted[1] * 60 * 60 * 1000
    time += splitted[2] * 60 * 1000
    time += splitted[3] * 1000
  } else if (splitted.length == 3) {
    time += splitted[0] * 60 * 60 * 1000
    time += splitted[1] * 60 * 1000
    time += splitted[2] * 1000
  } else if (splitted.length == 2) {
    time += splitted[0] * 60 * 1000
    time += splitted[1] * 1000
  } else if (splitted.length == 1) {
    time += splitted[0] * 1000
  }

  return time;
}

module.exports = {
  name: `seek`,
  cooldown: 5,
  desc: `Skips to a current part of a song`,
  async execute(message, args, client) {
    if (!args[0]) return message.channel.send(client.musicFunc.NoArgument(message, client))
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (!message.guild.me.voice.channel) return message.channel.send(client.musicFunc.BotNotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NothingPlaying(message, client))
    if (!client.player.isPlaying(message)) return message.channel.send(client.musicFunc.NothingPlaying(message, client))

    let track = client.player.nowPlaying(message)

    let milliseconds = 0

    if (Turn_in_to_MS(args.join(` `)) == undefined) {
      return message.channel.send(client.musicFunc.NoArgument(message, client).setDescription(`**Invalid Argument Found**`))
    }

    milliseconds = Turn_in_to_MS(args.join(` `))

    if (milliseconds > track.durationMS) return message.channel.send(`**${client.allInfo.emojis.exclamation_question} Cannot Skip to time because it is ahead of the song!**`)
    client.player.seek(message, milliseconds);
    return message.channel.send(`**${client.allInfo.emojis.headphones} Seeked to \`${args.join(` `)}\`**`)
  }
}