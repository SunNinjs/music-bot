module.exports = {
  name: `errors`,
  cooldown: 5,
  desc: `Shows all error codes`,
  async execute(message, args, client) {
    if (!args[0]) return message.channel.send(client.mainFunc.ErrorCodes())
    return message.channel.send(client.mainFunc.InvalidBotPermissions(message))
  }
}