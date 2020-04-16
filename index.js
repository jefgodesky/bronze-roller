const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const State = require('./state')

const { begin, end, assignCompanion, listCompanions } = require('./commands/story')
const parseRoll = require('./commands/roll')
const x = require('./commands/x')
const help = require('./commands/help')
const personality = require('./commands/personality')
const drawName = require('./commands/names')

const state = new State()
client.once('ready', () => {
  state.loadEmoji(client)
})

client.on('message', msg => {
  const { author, content } = msg
  if (author.bot) return
  const m = content.toLowerCase()

  if (m === 'x') {
    x(msg, client, state)
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
