const Discord = require('discord.js')
const random = require('random')
const client = new Discord.Client()
const { randomName } = require('./names')
const config = require('./config.json')
const emoji = {}

/**
 * Capitalize a string.
 * @param str {string} - The string to capitalize.
 * @returns {string} - The original string, capitalized.
 */

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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
 * Interpret dice results for a Namedealer.
 * @param rolls {Object} - An object representing the dice roll results.
 * @returns {string} - A string interpreting dice results for a Namedealer.
 */

const getNamedealerResults = rolls => {
  const { gold, jet } = rolls.strikes
  let destinies = null
  if (gold + jet > 2) {
    const total = gold + jet - 2
    const destiny = total === 1 ? `a desinty` : `${total} destinies`
    destinies = `seize ${destiny}`
  }

  let vulnerability = null
  if (gold > jet) {
    vulnerability = 'you are vulnerable to your Named Ones now. They may demand a labor of you.'
  }

  let reply = '**If you are a Namedealer,**'
  if (destinies && vulnerability) {
    reply = `${reply} ${destinies}, and ${vulnerability}`
  } else if (destinies) {
    reply = `${reply} ${destinies}.`
  } else if (vulnerability) {
    reply = `${reply} ${vulnerability}`
  } else {
    reply = null
  }

  return reply
}

/**
 * Interpret dice results for a Fated Hero.
 * @param rolls {Object} - An object representing the dice roll results.
 * @returns {string} - A string interpreting dice results for a Fated Hero.
 */

const getFatedHeroResults = rolls => {
  const feat = rolls.strikes.gold > 2
    ? 'you may perform a mighty feat, granted abilities greater than those of other mortals. Take a third consequence.'
    : null

  const goldFours = rolls.results.gold.filter(r => r === 4).length
  const jetFours = rolls.results.jet.filter(r => r === 4).length
  const totalFours = goldFours + jetFours
  const destinies = totalFours === 1
    ? 'if you have shouted to all your name, have brandished your trophies proudly, and impressed upon all those present your magnificence, seize a destiny'
    : totalFours > 1
      ? `if you have shouted to all your name, have brandished your trophies proudly, and impressed upon all those present your magnificence, seize ${totalFours} destinies`
      : null

  let vulnerability = null
  if (rolls.strikes.jet > rolls.strikes.gold) {
    vulnerability = 'you are vulnerable to your Great Name now. They may demand a labor of you.'
  }

  let reply = '**If you are a Fated Hero,**'
  if (feat && destinies && vulnerability) {
    reply = `${reply} ${feat} ${capitalize(destinies)}. ${capitalize(vulnerability)}`
  } else if (feat && destinies) {
    reply = `${reply} ${feat} ${capitalize(destinies)}.`
  } else if (feat && vulnerability) {
    reply = `${reply} ${feat} ${capitalize(vulnerability)}`
  } else if (destinies && vulnerability) {
    reply = `${reply} ${destinies}. ${capitalize(vulnerability)}`
  } else if (feat) {
    reply = `${reply} ${feat}`
  } else if (destinies) {
    reply = `${reply} ${destinies}.`
  } else if (vulnerability) {
    reply = `${reply} ${vulnerability}`
  } else {
    reply = null
  }

  return reply
}

/**
 * Make a roll.
 * @param msg {Object} - The `msg` object from Discord.js
 * @param gold {number} - The number of gold dice to roll.
 * @param jet {number} - The number of jet dice to roll.
 */

const roll = (msg, gold, jet) => {
  if (Object.keys(emoji).length === 0) findEmoji()
  const roll = { results: { gold: [], jet: [] }, strikes: { gold: 0, jet: 0 } }
  for (let g = 0; g < gold; g++) roll.results.gold.push(random.int(1, 6))
  for (let j = 0; j < jet; j++) roll.results.jet.push(random.int(1, 6))
  roll.strikes.gold = roll.results.gold.filter(r => r > 4).length
  const goldStrikesMsg = roll.strikes.gold === 0 ? 'no strikes' : roll.strikes.gold === 1 ? '1 strike' : `${roll.strikes.gold} strikes`
  roll.strikes.jet = roll.results.jet.filter(r => r > 4).length
  const jetStrikesMsg = roll.strikes.jet === 0 ? 'no strikes' : roll.strikes.jet === 1 ? '1 strike' : `${roll.strikes.jet} strikes`
  let rolls = ''
  roll.results.gold.forEach(r => { rolls = `${rolls} ${emoji.gold[r - 1]}` })
  roll.results.jet.forEach(r => { rolls = `${rolls} ${emoji.jet[r - 1]}` })

  let outcome = ''
  switch (roll.strikes.gold + roll.strikes.jet) {
    case 0:
      outcome = '**You have failed!** Your opposition may make a demand of your companion. If you refuse that demand, they may harm your companion!'
      break
    case 1:
      outcome = '**You have succeeded.** Choose one consequence.'
      break
    default:
      outcome = `**You have succeeded!** Choose two consequences.`
      break
  }

  const reply = [
    rolls.trim(),
    `You have rolled **${jetStrikesMsg}** upon your mortal dice of jet, and **${goldStrikesMsg}** upon your immortal dice of gold.`,
    outcome,
    getNamedealerResults(roll),
    getFatedHeroResults(roll)
  ].filter(l => l !== null)
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
