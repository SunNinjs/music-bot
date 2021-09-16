const { MessageEmbed } = require(`discord.js`)

const info = {
  color: `#3fbf9b`,
  errColor: `#73110a`,
  footer: `Made By Sun#4798 || Dm if any issues!`,
  emojis: {
    X: `❌`,
    exclamation_question: `⁉️`,
    headphones: `🎧`,
  }
}

const ErrorCodes = {
  200001: `Command Executor is not in a Voice Channel`,
  200002: `Command Executor is not in the same Voice Channel as the bot`,
  200004: `There is no songs in the queue`,
  200003: `Bot is not in a Voice Channel`,
  200005: `Nothing is playing`,
  100001: `Invalid Permissions`,
  100002: `Invalid Bot Permissions`,
  100003: `Argument Missing or not valid`,
}

function Addons(client) {
  client.allInfo = info
  client.errorCodes = ErrorCodes
  client.musicFunc = {
    onPlay(message, client) {
      message.channel.send(`Started playing new song`)
    },
    onPause(message, client) {
      message.channel.send(`Paused Current Song`)
    },
    NotInVoice(message, client) {
      const NV_Embed = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __200001__`)
        .setDescription(`**<@${message.author.id}> is not in a Voice Channel**`);

      return NV_Embed
    },
    BotNotInVoice(message, client) {
      const NV_Embed = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __200003__`)
        .setDescription(`**${client.user.username} is not in a Voice Channel**`);

      return NV_Embed
    },
    NothingPlaying(message, client) {
      const NV_Embed = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __200005__`)
        .setDescription(`**Nothing is playing on the bot**`);

      return NV_Embed
    },
    NotInSameVoice(message, client) {
      const NIS_Embed = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __200002__`)
        .setDescription(`**<@${message.author.id}> is not in the same Voice Channel as the ${client.user.username}`);

      return NIS_Embed
    },
    NoQueue(message, client) {
      const Queue_Embed = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __200004__`)
        .setDescription(`**Queue is empty.**`)

      return Queue_Embed
    },
    NoArgument(message, client) {
      const NoArg = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __100003__`)
        .setDescription(`**No Argument Found**`)

      return NoArg;
    },


  }

  client.mainFunc = {
    split(string, length, splitby, newsplit) {
      let arr = string.split(`${splitby}`)
      let characters = ``;
      let finishedarray = []
    
      for (i=0;i<arr.length;i++) {
        let newarg = arr[i]+newsplit;
        if (characters.length+newarg.length >= length) {
          finishedarray.push(characters)
          characters = newarg
        } else {
          if (i==arr.length-1) {
            if (!arr[i] == ``) {
              arr[i] = arr[i]+newsplit
            }
            let newchar = characters+arr[i];
            finishedarray.push(newchar)
          } else {
            characters += newarg;
          }
        }
      }
    
      return finishedarray;
    },
    add_space(string, length) {
      for (i=0;i<length;i++) {
        string += ` `
      }
      return string
    },
    progressBar(number, numberdone) {
      if (numberdone == 0) {
        return { string: `🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`, percentage: 0 }
      } else {  
        let percentage = Math.ceil((numberdone / number) * 100)
        let string = ``
        for (i=0;i<100;i+=3.33) {
          let nextnumber = i + 3.33
          if (percentage > i && percentage < nextnumber) {
            string += `🔘`
          } else {
            string += `▬`
          }
        }
        return { string, percentage }
      }

      /*if (numberdone > number) return 100;
      let percentage = ((numberdone / number) * 100).toFixed(0)
      let string = ``
      for (i=0;i<50;i++) {
        if (i < percentage/2) {
          string += `#`
        } else { string += `-` }
      }
      string += ` ${numberdone}/${number} ${percentage}%`;
      return string;*/
    },
    ErrorCodes() {
      const ErrorEmbed = new MessageEmbed()
        .setColor(info.color)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`All Error Codes in the ${client.user.username}`)

      let MusicErrors = ``
      let RegularErrors = ``;
      let keys = Object.keys(ErrorCodes);
      for (i=0;i<keys.length;i++) {
        switch (keys[i][0]) {
          case "1":
            RegularErrors += `**Code** \`${keys[i]}\` - ${ErrorCodes[`${keys[i]}`]}\n`
            break;
          case "2":
            MusicErrors += `**Code** \`${keys[i]}\` - ${ErrorCodes[`${keys[i]}`]}\n`
            break;
        }
      }

      ErrorEmbed.addField(`Regular Errors`, RegularErrors)
      ErrorEmbed.addField(`Music Errors`, MusicErrors)
      
      return ErrorEmbed;
    },
    InvalidPermissions(message) {
      const Missing_Permissions = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __100001__`)
        .setDescription(`**<@${message.author.id}> has insufficient permissions to run this command**`);

      return Missing_Permissions
    },
    InvalidBotPermissions(message) {
      const Bot_perms = new MessageEmbed()
        .setColor(info.errColor)
        .setFooter(info.footer)
        .setTimestamp()
        .setTitle(`${info.emojis.X} Error: __100002__`)
        .setDescription(`**${client.user.username} has insufficient permissions to run this command**`);

      return Bot_perms
    },
    MinutesAndSeconds(date) {
      if (!date) date = Date.now()
      let seconds = Math.ceil(date/1000)
      if (seconds >= 60) {
        let minutes = Math.floor(seconds/60)
        let remainingSeconds = seconds % 60
        if (minutes >= 60) {
          let hours = Math.floor(minutes/60)
          let remainingMinutes = minutes % 60
          if (toString(remainingMinutes).length == 1) remainingMinutes = `0${minutes}`
          return `${hours}:${remainingMinutes}:${remainingSeconds}`
        }
        if (toString(seconds).length == 1) seconds = `0${seconds}`
        return `${minutes}:${remainingSeconds}`
      }
      return `${seconds}`

    },
    Turn_in_to_MS(current) {
      let splitted = current.split(`:`)
      time = 0;
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
    },

  }
}

class CompressedMessage {
  constructor(message) {
    this.activity = message.activity;
    this.application = message.application;
    this.author = message.author.id;
    this.channel = message.channel.id;
    this.cleanContent = message.cleanContent;
    this.content = message.content;
    this.createdAt = message.createdAt;
    this.createdTimestamp = message.createdTimestamp;
    this.deleteable = message.deleteable;
    this.deleted = message.deleted;
    this.editable = message.editable;
    this.editedAt = message.editedAt;
    this.editedTimestamp = message.editedTimestamp;
    this.embeds = message.embeds;
    this.guild = message.guild.id;
    this.id = message.id;
    this.mentions = message.mentions;
    this.reactions = message.reactions.cache;
    this.type = message.type;
    this.url = message.url;
    //Methods
    this.delete = message.delete;
    this.edit = message.edit;
    this.fetch = message.fetch;
    this.react = message.react;
  }
}

module.exports = { Addons, CompressedMessage };