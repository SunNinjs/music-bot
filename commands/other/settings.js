const { MessageEmbed } = require("discord.js");
const Settings = require(`../../schemas/settings.js`)

function channelcheck(message, argument, index) {
  let channel = message.guild.channels.cache.get(argument)
  if (channel == undefined) {
    channel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === argument.toLowerCase())
    if (channel == undefined) {
      channel = message.mentions.channels.array()[index]
      if (channel == undefined) return undefined;
    }
  }

  return channel;
}

module.exports = {
  name: `settings`,
  cooldown: 5,
  desc: `The settings for the music bot`,
  async execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Settings Embed`)

    let settings = await Settings.findOne({GuildID: message.guild.id})
    let info = client.allInfo;

    switch (args[0].toLowerCase()) {
      case "prefix":
        if (!args[1]) return message.channel.send(client.musicFunc.NoArgument(message, client))
        await Settings.findOneAndUpdate({GuildID: message.guild.id}, { prefix: args[1].toLowerCase() })
        message.channel.send(`Prefix has been set to \`${args[1]}\``)
        break;
      case "blacklist":
        if (!args[1]) return message.channel.send(client.musicFunc.NoArgument(message, client))
        let length = args.length - 1
        let string = `**\``;
        let secondarr = [];
        for (i=0;i<length;i++) {
          let channel2 = channelcheck(message, args[i + 1], i)
          if (channel2 == undefined) {message.channel.send(`**${client.allInfo.emojis.X} Channel Could Not Be Found**`); continue;}
          if (settings.blacklist.includes(channel2.id)) {
            secondarr.push(channel2)
            continue;
          } else {
            settings.blacklist.push(channel2.id)
          }
          if (i==length-1) {
            string += `${channel2.name}`
          } else {
            string += `${channel2.name} `
          }
        }
        if (string !== `**\``) message.channel.send(`${string}\` has been added to blacklist**`);
        if (secondarr.length !== 0) {
          secondarr.forEach((ele, index) => {
            let indexOf = settings.blacklist.indexOf(ele.id)
            settings.blacklist.splice(indexOf, 1);
          })
          message.channel.send(`**\`${secondarr.map(r => r.name).join(` `)}\` has been removed from blacklisted channels**`)
        }
        await Settings.findOneAndUpdate({GuildID: message.guild.id}, { blacklist: settings.blacklist })
        break;
      case "reset":
        let newsettings = {
          dev: `221403951700901888`,
          GuildID: message.guild.id,
          prefix: process.env.PREFIX,
          blacklist: [],
          djrole: [],
          djonly: false,
          defaultvolume: 100,
        }

        let olddjrole = ``;
        let oldblacklist = ``;

        if (settings.djrole.length == 0) {olddjrole = `None`} else {olddjrole = settings.djrole.join(` `)}
        if (settings.blacklist.length == 0) {oldblacklist = `None`} else {oldblacklist = settings.blacklist.join(` `)}

        let djrole = ``;
        let blacklist = ``;

        if (newsettings.djrole.length == 0) {djrole = `None`} else {djrole = newsettings.djrole.join(` `)}
        if (newsettings.blacklist.length == 0) {blacklist = `None`} else {blacklist = newsettings.blacklist.join(` `)}

        let settingsReset = new MessageEmbed()
          .setColor(info.color)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`Settings Have Been Reset!`)
          .addField(`Old Settings`, `**Prefix:** \`${settings.prefix}\`\n**Dj Only:** \`${settings.djonly}\`\n**Default Volume:** \`${settings.defaultvolume}\`\n**Dj Roles:** \`${olddjrole}\`\n**Blacklisted Channels:** \`${oldblacklist}\``, true)
          .addField(`New Settings`, `**Prefix:** \`${newsettings.prefix}\`\n**Dj Only:** \`${newsettings.djonly}\`\n**Default Volume:** \`${newsettings.defaultvolume}\`\n**Dj Roles:** \`${djrole}\`\n**Blacklisted Channels:** \`${blacklist}\``, true)

        await Settings.findOneAndUpdate({GuildID: message.guild.id}, newsettings)
        message.channel.send(settingsReset)
        break;
      case "defaultvolume":
        if (!args[1]) return message.channel.send(client.musicFunc.NoArgument(message, client))
        let number = Number.parseInt(args[1])
        if (number == undefined) return message.channel.send(`**${client.allInfo.emojis.X} Invalid Argument, must be a number**`)

        if (0 >= number || number > 200) return message.channel.send(`**${client.allInfo.emojis.X} Invalid Argument, must be a number between 1 and 200**`)
        await Settings.findOneAndUpdate({GuildID: message.guild.id}, { defaultvolume: number })
        message.channel.send(`**Default Volume has been set to \`${number}\`**`)
        break;
    }
  }
}