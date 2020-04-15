const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

const { begin, end, assignCompanion, listCompanions } = require('./commands/story')
const parseRoll = require('./commands/roll')
const x = require('./commands/x')
const help = require('./commands/help')
const personality = require('./commands/personality')
const drawName = require('./commands/names')

const state = { channels: {} }
client.once('ready', async () => {
  const count = []
  for (let i = 1; i < 7; i++) count.push(i)
  state.emoji = {
    gold: count.map(i => client.emojis.cache.find(emoji => emoji.name === `gold${i}`)),
    jet: count.map(i => client.emojis.cache.find(emoji => emoji.name === `jet${i}`))
  }
})

client.on('message', msg => {
  const { author, content } = msg
  if (author.bot) return
  const m = content.toLowerCase()

  if (m === 'x') {
    x(msg)
  } else if (m.startsWith('roll')) {
    parseRoll(msg, state)
  } else if (m.includes('draw from the well of names')) {
    drawName(msg)
  } else if (m.startsWith('i portray')) {
    assignCompanion(msg, state)
  } else if (m === 'bash, who here joins me?') {
    listCompanions(msg, state)
  } else if (m.startsWith('our tale is ended')) {
    end(msg, state)
  } else if (m.startsWith('we begin a new tale')) {
    begin(msg, state)
  } else if (m.startsWith('what binds you, bash')) {
    help(msg)
  } else if (m.startsWith('tell us about yourself, bash')) {
    personality(msg)
  }
})

client.login(config.token)
