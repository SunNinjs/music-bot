const { MessageButton } = require('discord-buttons');
const { MessageEmbed } = require(`discord.js`)

let rock = new MessageButton()
  .setStyle(`red`)
  .setID(`rock`)
  .setLabel(`Rock`)

let paper = new MessageButton()
  .setStyle(`red`)
  .setID(`paper`)
  .setLabel(`Paper`)

let scissors = new MessageButton()
  .setStyle(`red`)
  .setID(`scissors`)
  .setLabel(`Scissors`)

let quit = new MessageButton()
  .setStyle(`green`)
  .setID(`quit`)
  .setLabel(`Quit`)

let emojis = {
  rock: `🪨`,
  paper: `📄`,
  scissors: `✂️`,
}

async function checkmember(message, string_member, num) {
  let mem = message.guild.members.cache.get(`${string_member}`)
  if (typeof mem == `undefined`) {
    mem = message.guild.members.cache.find(member => member.displayName.toLowerCase() === `${string_member.toLowerCase()}`)
    if (typeof mem == `undefined`) {
      mem = message.guild.members.cache.find(member => member.user.username.toLowerCase() === `${string_member.toLowerCase()}`)
      if (typeof mem == `undefined`) {
        mem = message.mentions.members.array()[num]
        if (!mem) return undefined
      }
    }
  }

  return mem;
}

let member_selection = {
  first: `none`,
  second: `none`,
  game: false
}

function winner_check(first, second) {
  if (first === second) return false
  if (first === `rock` && second === `scissors`) {
    return `first`
  } else if (first === `paper` && second === `rock`) {
    return `first`
  } else if (first === `scissors` && second === `paper`) {
    return `first`
  } else {
    return `second`
  }
}

async function game_check(message, client, member, mes, collector) {
  if (member_selection.first != `none` && member_selection.second != `none`) {
    let winner = winner_check(member_selection.first, member_selection.second)
    
    if (!winner) {
      mes.edit(`The game resulted in a tie\nFirst Person Chose ${emojis[member_selection.first]}\nSecond Person Chose ${emojis[member_selection.first]}`, {embed: null})
      member_selection.first = `none`;
      member_selection.second = `none`;
    } else {
      let realwinner;
      let loser;
      winner == `first` ? realwinner = message.member : realwinner = member
      if (winner == `first`) {loser = `second`} else loser = `first`;

      let winner_embed = new MessageEmbed()
        .setColor(client.allInfo.color)
        .setFooter(client.allInfo.footer)
        .setTimestamp()
        .setTitle(`The Winner is ${realwinner.displayName}`)
        .setDescription(`**Winner Chose:** ${emojis[member_selection[winner]]}\n**Loser Chose:** ${emojis[member_selection[loser]]}`)

      mes.edit({embed: winner_embed, buttons: null})
      collector.stop(`game has ended`)
      member_selection.first = `none`;
      member_selection.second = `none`;
    }
  }
}

module.exports = {
  name: `rps`,
  names: [`rock_paper_scissors`],
  cooldown: 5,
  desc: `Rock Paper Scissors game`,
  async execute(message, args, client) {

    if (!args[0]) return message.channel.send(client.musicFunc.NoArgument(message, client))

    let member = await checkmember(message, args[0], 0)
    if (!member) return message.channel.send(client.musicFunc.NoArgument(message, client).setDescription(`**Invalid Argument, Member was not found**`))
    if (member.id === message.author.id) return message.channel.send(client.musicFunc.NoArgument(message, client).setDescription(`**Invalid Argument, Cannot invite yourself to the game**`))
    if (member.user.bot) return message.channel.send(client.musicFunc.NoArgument(message, client).setDescription(`**Invalid Argument, Cannot invite bots to the game**`))

    if (!member.permissionsIn(message.channel.id).toArray().some(perm => [`VIEW_CHANNEL`, `SEND_MESSAGES`].includes(perm))) return message.channel.send(client.mainFunc.InvalidPermissions(message).setDescription(`**${member.displayName} does not have perms to see this channel or type**`))

    const waiting_for_invite = new MessageEmbed()
      .setColor(client.allInfo.color)
      .setFooter(client.allInfo.footer)
      .setTimestamp()
      .setTitle(`Waiting for Player`)
      .setDescription(`Once the player accepts the game will begin.`)

    let mes = await message.channel.send({embed: waiting_for_invite})
    const invite_embed = new MessageEmbed()
    .setColor(client.allInfo.color)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(`${message.author.username} has invited you to play a game!`)
    .setDescription(`✅ : To accept the game invite\n🇽 : To decline the game invite`)
  
    const accepted_embed = new MessageEmbed()
    .setColor(client.allInfo.color)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(`You have accepted the game invite!`)
    .setDescription(`The game will take place in <#${message.channel.id}>\nPlease navigate to the channel to play the game.`)
  
    const cannot_do_anything_anymore = new MessageEmbed()
    .setColor(client.allInfo.color)
    .setFooter(client.allInfo.footer)
    .setTimestamp()
    .setTitle(`You have either declined or ran out of time to react.`)
  
    let dm = await member.send(invite_embed)
    dm.react(`✅`).then(() => dm.react(`🇽`));
  
    const dmCollector = dm.createReactionCollector(
      (reaction, user) => [`✅`, `🇽`].includes(reaction.emoji.name) && user.id === member.id,
      { time: 30000 }
    )
  
    dmCollector.on(`collect`, async (reaction) => {
      if (reaction.emoji.name == `✅`) {
        await dm.edit(accepted_embed)

        member_selection.game = true;

        const game_embed = new MessageEmbed()
        .setColor(client.allInfo.color)
        .setFooter(client.allInfo.footer)
        .setTimestamp()
        .setTitle(`Rock Paper Scissors`)
        .setDescription(`The match is between **Challenger ${message.member.displayName}** and **Challenged ${member.displayName}**`)
        .addField(`${message.member.displayName}'s Corner`, `Selection: ||None Yet||`, true)
        .addField(`${member.displayName}'s Corner`, `Selection: ||None Yet||`, true)
        .addField(`Controls`, `🪨 : Rock\n✂️ : Scissors\n📄 : Paper`, false)
  
      mes.edit({embed: game_embed, buttons: [rock, paper, scissors, quit]})
  
      const collector = mes.createButtonCollector(
        (button) => [message.author.id, member.id].includes(button.clicker.user.id),
        {time: 30000}
      )
  
      collector.on(`collect`, async reaction => {
        collector.resetTimer();
        reaction.defer();
        let reaction_owner = undefined;
        let usernumber = undefined;
        if (reaction.clicker.user.id == message.author.id) {reaction_owner = { member: message.member, selection: `first` }; usernumber = 0;} else reaction_owner = { member: member, selection: `second` }; usernumber = 1;
        if (member_selection[reaction_owner.selection] !== `none` && reaction.id != `quit`) return;
        console.log(`${reaction.clicker.user.username} chose ${reaction.id}`)
        switch (reaction.id) {
          case "rock":
            member_selection[reaction_owner.selection] = `rock`;
            let embed = mes.embeds[0]
            let indexOf = embed.fields.indexOf(embed.fields.filter(field => field.name === `${reaction_owner.member.displayName}'s Corner`)[0])
            embed.fields[indexOf] = { name: `${reaction_owner.member.displayName}'s Corner`, value: `Selection: ||None Yet||\n**FINISHED SELECTION**`, inline: true }
            mes.edit({embed: embed, buttons: [rock, paper, scissors, quit]})
            await game_check(message, client, member, mes, collector)
            break;
          case "paper":
            member_selection[reaction_owner.selection] = `paper`;
            let embed2 = mes.embeds[0]
            let indexOf2 = embed2.fields.indexOf(embed2.fields.filter(field => field.name === `${reaction_owner.member.displayName}'s Corner`)[0])
            embed2.fields[indexOf2] = { name: `${reaction_owner.member.displayName}'s Corner`, value: `Selection: ||None Yet||\n**FINISHED SELECTION**`, inline: true }
            mes.edit({embed: embed2, buttons: [rock, paper, scissors, quit]})
            await game_check(message, client, member, mes, collector)
            break;
          case "scissors":
            member_selection[reaction_owner.selection] = `scissors`;
            let embed3 = mes.embeds[0]
            let indexOf3 = embed3.fields.indexOf(embed3.fields.filter(field => field.name === `${reaction_owner.member.displayName}'s Corner`)[0])
            embed3.fields[indexOf3] = { name: `${reaction_owner.member.displayName}'s Corner`, value: `Selection: ||None Yet||\n**FINISHED SELECTION**`, inline: true }
            mes.edit({embed: embed3, buttons: [rock, paper, scissors, quit]})
            await game_check(message, client, member, mes, collector)
            break;
          case "quit":
            collector.stop(`${reaction_owner.member.displayName} has forfieted the game`)
            break;
        }
      })
  
      collector.on(`end`, (collected, reason) => {
        if (reason == `game has ended`) return;
        mes.edit(`Game Has Ended\nReason: ${reason}`, {embed: null, buttons: null})
      })

      } else if (reaction.emoji.name == `🇽`) {
        dmCollector.stop(`rejected`);
      }
    })
  
    dmCollector.on(`end`, async (reaction, reason) => {
      await dm.edit(cannot_do_anything_anymore)
      if ((reason == `time` || reason == `rejected`) && member_selection.game == false) return mes.edit(`**The Player has Declined your offer**`, { embed: null })
    })

  }
}