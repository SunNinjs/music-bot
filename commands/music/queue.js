const { MessageEmbed } = require(`discord.js`)
const { MessageButton } = require(`discord-buttons`)

let rightbutton = new MessageButton()
  .setStyle(`green`)
  .setID(`right`)
  .setLabel(`==>`)

let leftbutton = new MessageButton()
  .setStyle(`green`)
  .setID(`left`)
  .setLabel(`<==`)

module.exports = {
  name: `queue`,
  names: [`q`],
  cooldown: 5,
  desc: `Shows all the songs in the queue`,
  async execute(message, args, client) {

    const { allInfo } = client;

    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NoQueue(message, client))
    if (client.player.getQueue(message).tracks.length == 0) return message.channel.send(client.musicFunc.NoQueue(message, client))

    let queue = client.player.getQueue(message)

    let queueEmbed = new MessageEmbed()
      .setColor(allInfo.color)
      .setFooter(allInfo.footer)
      .setTimestamp()
      .setTitle(`${queue.tracks.length} Song(s) in Queue`)

    let desc = `__Current Playing Song__\n[${queue.playing.author} - ${queue.playing.title}](${queue.playing.url}) **${queue.playing.duration} Requested by ${queue.playing.requestedBy.username}**\n\n`;

    if (queue.tracks.length > 1) {
      desc += `__Songs In Queue__`
      let pages = Math.ceil((queue.tracks.length-1) / 10)
      if (pages == 1) {
        for (i=1;i<queue.tracks.length;i++) {
          let track = queue.tracks[i]
          queueEmbed.addField(`\u200B`, `\`#${i+1}\` [${track.author} - ${track.title}](${track.url}) | **${queue.playing.duration} Requested by ${track.requestedBy.username}**`)
        }
      } else {
        for (i=1;i<11;i++) {
          let track = queue.tracks[i]
          queueEmbed.addField(`\u200B`, `\`#${i+1}\` [${track.author} - ${track.title}](${track.url}) | **${queue.playing.duration} Requested by ${track.requestedBy.username}**`)
        }
      }
      let ms = 0;
      queue.tracks.forEach(track => ms += track.durationMS)
      queueEmbed.addField(`\u200B`, `**${client.mainFunc.MinutesAndSeconds(ms)} total length**`)
      queueEmbed.setDescription(desc)

      let mes = await message.channel.send({ buttons: [rightbutton], embed: queueEmbed.setFooter(`${allInfo.footer} || Page 1/${pages}`) })
      const collector = mes.createButtonCollector(
        (button) => button.clicker.user.id === message.author.id,
        { time: 30000 }
        
      )

      let currentIndex = 0;
      collector.on(`collect`, reaction => {
        collector.resetTimer();
        queueEmbed.fields = [];
        reaction.defer();
        reaction.id === `left` ? currentIndex -= 1 : currentIndex += 1
        if (queue.tracks.length < (10 * currentIndex) + 10) {
          for (j = 10 * currentIndex;j < queue.tracks.length; j++) {
            let track = queue.tracks[j]
            queueEmbed.addField(`\u200B`, `\`#${j+1}\` [${track.author} - ${track.title}](${track.url}) | **${queue.playing.duration} Requested by ${track.requestedBy.username}**`)
          }
          let ms = 0;
          queue.tracks.forEach(track => ms += track.durationMS)
          queueEmbed.addField(`\u200B`, `**${client.mainFunc.MinutesAndSeconds(ms)} total length**`)
        } else {
          for (j = 10 * currentIndex;j < (10 * currentIndex) + 10;j++) {
            let track = queue.tracks[j]
            queueEmbed.addField(`\u200B`, `\`#${j+1}\` [${track.author} - ${track.title}](${track.url}) | **${queue.playing.duration} Requested by ${track.requestedBy.username}**`)
          }
          let ms = 0;
          queue.tracks.forEach(track => ms += track.durationMS)
          queueEmbed.addField(`\u200B`, `**${client.mainFunc.MinutesAndSeconds(ms)} total length**`)
        }
        if (currentIndex !== 0 && currentIndex < pages - 1) {
          mes.edit({ buttons: [leftbutton, rightbutton], embed: queueEmbed.setFooter(`${allInfo.footer} || Page ${currentIndex+1}/${pages}`) })
        } else if (currentIndex !== 0) {
          mes.edit({ buttons: [leftbutton], embed: queueEmbed.setFooter(`${allInfo.footer} || Page ${currentIndex+1}/${pages}`) })
        } else if (currentIndex < pages - 1) {
          mes.edit({ buttons: [rightbutton], embed: queueEmbed.setFooter(`${allInfo.footer} || Page ${currentIndex+1}/${pages}`) })
        }
      })

      collector.on(`end`, () => {
        mes.edit({buttons: [], embed: queueEmbed})
      })
    } else {
      let ms = 0;
      queue.tracks.forEach(track => ms += track.durationMS)
      queueEmbed.addField(`\u200B`, `**${client.mainFunc.MinutesAndSeconds(ms)} total length**`)
      queueEmbed.setDescription(desc)
  
      message.channel.send(queueEmbed)
    }

  }
}