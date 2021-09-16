module.exports = {
  name: `ping`,
  cooldown: 5,
  desc: `Pong!`,
  async execute(message, args, client) {
    let firstmes = await message.channel.send(`Pong!`)
    let time = firstmes.createdTimestamp - message.createdTimestamp
    firstmes.edit(`Pong! \`${time} ms\``)
  }
}