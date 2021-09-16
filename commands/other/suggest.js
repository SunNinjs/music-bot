const SuggestSchema = require(`../../schemas/suggestions.js`);
const { CompressedMessage } = require(`../../utils/functions.js`);
const { MessageEmbed } = require(`discord.js`);

module.exports = {
  name: `suggest`,
  cooldown: 60,
  desc: `Suggests any topic for the music bot`,
  async execute(message, args, client) {
    let suggestionChan = client.channels.cache.get(`887914687692431370`);
    if (message.channel.id != `729857886175494164`) return client.cooldowns.delete(message.author.id);
    if (!args[0]) {
      client.cooldowns.delete(message.author.id)
      message.delete();
      return message.channel.send(client.musicFunc.NoArgument().setDescription(`**Must Add Suggestion**`))
    }
    let suggestion = args.join(` `).trim();
    let allSuggestions = await SuggestSchema.find();
    let content = allSuggestions.map(sug => sug.suggestion);
    if (content.includes(suggestion)) {
      client.cooldowns.delete(message.author.id)
      message.delete();
      return message.channel.send(`Invalid, Suggestion has already been mentioned`)
    }

    let suggEmbed = new MessageEmbed().setColor(client.allInfo.color).setFooter(client.allInfo.footer).setTimestamp()
      .setTitle(`Suggestion From ${message.author.username}`)
      .setDescription(`**Suggestion:**\n${suggestion}`)

    let mes = await suggestionChan.send(suggEmbed);
    await mes.react(`👍`)
    await mes.react(`👎`)

    await SuggestSchema({
      author: message.author.id,
      suggestion: suggestion,
      message: new CompressedMessage(message)
    }).save();
    message.delete();
  }
}