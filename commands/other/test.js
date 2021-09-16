const { MessageButton } = require('discord-buttons');

let newbutton = new MessageButton()
  .setStyle(`red`)
  .setID(`test`)
  .setLabel(`Test button`)

module.exports = {
  name: `test`,
  cooldown: 5,
  desc: `test`,
  beta: true,
  async execute(message, args, client) {
    let firstmes = await message.channel.send(`Testing`, { buttons: [newbutton] })
    const collector = await firstmes.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 60000 })

    collector.on(`collect`, b => {
      
    })
  }
}