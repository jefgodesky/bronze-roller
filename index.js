const Discord = require('discord.js')
const random = require('random')
const client = new Discord.Client()
const { randomName } = require('./names')
const config = require('./config.json')
const emoji = {}

/**
 * Find the emoji we use for dice results and store them in `state`.
 */

const findEmoji = () => {
  emoji.gold = [
    client.emojis.cache.find(emoji => emoji.name === 'gold1'),
    client.emojis.cache.find(emoji => emoji.name === 'gold2'),
    client.emojis.cache.find(emoji => emoji.name === 'gold3'),
    client.emojis.cache.find(emoji => emoji.name === 'gold4'),
    client.emojis.cache.find(emoji => emoji.name === 'gold5'),
    client.emojis.cache.find(emoji => emoji.name === 'gold6')
  ]

  emoji.jet = [
    client.emojis.cache.find(emoji => emoji.name === 'jet1'),
    client.emojis.cache.find(emoji => emoji.name === 'jet2'),
    client.emojis.cache.find(emoji => emoji.name === 'jet3'),
    client.emojis.cache.find(emoji => emoji.name === 'jet4'),
    client.emojis.cache.find(emoji => emoji.name === 'jet5'),
    client.emojis.cache.find(emoji => emoji.name === 'jet6')
  ]
}

/**
 * Make a roll.
 * @param msg {Object} - The `msg` object from Discord.js
 * @param gold {number} - The number of gold dice to roll.
 * @param jet {number} - The number of jet dice to roll.
 */

const roll = (msg, gold, jet) => {
  if (Object.keys(emoji).length === 0) findEmoji()
  const goldResults = []
  const jetResults = []
  for (let g = 0; g < gold; g++) goldResults.push(random.int(1, 6))
  for (let j = 0; j < jet; j++) jetResults.push(random.int(1, 6))
  const goldStrikes = goldResults.filter(r => r > 4).length
  const goldStrikesMsg = goldStrikes === 0 ? 'no strikes' : goldStrikes === 1 ? '1 strike' : `${goldStrikes} strikes`
  const jetStrikes = jetResults.filter(r => r > 4).length
  const jetStrikesMsg = jetStrikes === 0 ? 'no strikes' : jetStrikes === 1 ? '1 strike' : `${jetStrikes} strikes`
  let rolls = ''
  goldResults.forEach(r => { rolls = `${rolls} ${emoji.gold[r - 1]}` })
  jetResults.forEach(r => { rolls = `${rolls} ${emoji.jet[r - 1]}` })
  const reply = [
    rolls.trim(),
    `You have rolled **${jetStrikesMsg}** upon your mortal dice of jet, and **${goldStrikesMsg}** upon your immortal dice of gold.`
  ]
  msg.reply(reply.join('\n'))
}

/**
 * The main message processor.
 */

client.on('message', msg => {
  const m = msg.content.toLowerCase()
  if (m.startsWith('roll')) {
    const jetMatch = m.match(/(\d+) (dice of )?(of )?jet/i)
    const jetParse = jetMatch && jetMatch.length > 1 ? parseInt(jetMatch[1]) : undefined
    const jet = !jetParse || isNaN(jetParse) ? 0 : jetParse

    const goldMatch = m.match(/(\d+) (dice of )?(of )?gold/i)
    const goldParse = goldMatch && goldMatch.length > 1 ? parseInt(goldMatch[1]) : undefined
    const gold = !goldParse || isNaN(goldParse) ? 0 : goldParse

    if (jet + gold > 0) {
      roll(msg, gold, jet)
    }
  } else if (m.startsWith('give me a random name')) {
    msg.reply(randomName())
  }
})

client.login(config.token)
