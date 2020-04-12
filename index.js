const Discord = require('discord.js')
const client = new Discord.Client()
const { randomName } = require('./names')
const config = require('./config.json')

/**
 * The main message processor.
 */

client.on('message', msg => {
  if (msg.content.toLowerCase().startsWith('give me a random name')) {
    msg.reply(randomName())
  }
})

client.login(config.token)
