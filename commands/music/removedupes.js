const { Collection } = require("discord.js");

module.exports = {
  name: `removedupes`,
  names: [`rmd`, `rd`, `drm`],
  cooldown: 5,
  desc: `Removes all duplicate songs in queue`,
  async execute(message, args, client) {
    if (!message.member.voice.channel) return message.channel.send(client.musicFunc.NotInVoice(message, client))
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(client.musicFunc.NotInSameVoice(message, client))
    if (!client.player.getQueue(message)) return message.channel.send(client.musicFunc.NoQueue(message, client))
  
    let queue = client.player.getQueue(message);

    let result = new Collection();
    queue.tracks.forEach(item => {
      if (!result.has(item.url)) {
        result.set(item.url, item);
      }
    });

    queue.tracks = result.array();

    message.channel.send(`**Queue has been filtered**`)
  }
}