const random = require('random')
const { capitalize } = require('../utils')

/**
 * Interpret dice results for a Namedealer.
 * @param rolls {Object} - An object representing the dice roll results.
 * @param player {?Object} - The player object for the person who sent the
 *   message.
 * @returns {string|null} - A string interpreting dice results for a
 *   Namedealer, or `null` if there's nothing to report for a Namedealer.
 */

const interpretNamedealer = (rolls, player) => {
  const nature = player && player.nature ? player.nature : null
  if (nature === 'Fated Hero') return null

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

  let reply = nature === 'Namedealer' ? '**As a Namedealer**,' : '**If you are a Namedealer,**'
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
 * @param player {?Object} - The player object for the person who sent the
 *   message.
 * @returns {string|null} - A string interpreting dice results for a Fated
 *   Hero, or `null` if there's nothing to report for a Fated Hero.
 */

const interpretFatedHero = (rolls, player) => {
  const nature = player && player.nature ? player.nature : null
  if (nature === 'Namedealer') return null

  const feat = (rolls.strikes.gold + rolls.strikes.jet > 2) && (rolls.strikes.gold > 0)
    ? 'you may perform a mighty feat, granted abilities greater than those of other mortals. Take a third consequence.'
    : null

  const goldFours = rolls.gold.filter(r => r === 4).length
  const jetFours = rolls.jet.filter(r => r === 4).length
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

  let reply = nature === 'Fated Hero' ? '**As a Fated Hero**,' : '**If you are a Fated Hero,**'
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
 * @param gold {!number} - The number of gold dice to roll.
 * @param jet {!number} - The number of jet dice to roll.
 * @param results { gold: number[], jet: number[], strikes: { gold: number,
 *   jet: number } } - An object with three properties. `gold` and `jet` each
 *   contain an array of integers that are the result of a dice roll. `strikes`
 *   is an object with two properties, `gold` and `jet`, which each contain an
 *   integer for how many strikes were rolled on each type of die.
 */

const roll = (gold, jet) => {
  const results = { gold: [], jet: [], strikes: { gold: 0, jet: 0 } }
  for (let g = 0; g < gold; g++) results.gold.push(random.int(1, 6))
  for (let j = 0; j < jet; j++) results.jet.push(random.int(1, 6))
  results.strikes.gold = results.gold.filter(r => r > 4).length
  results.strikes.jet = results.jet.filter(r => r > 4).length
  return results
}

/**
 * Interpret dice results.
 * @param msg {!Message} - The Discord.js message object that we're answering.
 * @param state {!State} - An object with the current state of play.
 * @param roll { gold: number[], jet: number[], strikes: { gold: number,
 *   jet: number } } - An object with three properties. `gold` and `jet` each
 *   contain an array of integers that are the result of a dice roll. `strikes`
 *   is an object with two properties, `gold` and `jet`, which each contain an
 *   integer for how many strikes were rolled on each type of die.
 */

const interpret = (msg, state, roll) => {
  const player = state.getSender(msg)
  const goldStrikesMsg = roll.strikes.gold === 0 ? 'no strikes' : roll.strikes.gold === 1 ? '1 strike' : `${roll.strikes.gold} strikes`
  const jetStrikesMsg = roll.strikes.jet === 0 ? 'no strikes' : roll.strikes.jet === 1 ? '1 strike' : `${roll.strikes.jet} strikes`

  let rolls = ''
  roll.gold.forEach(r => { rolls = `${rolls} ${state.emoji.gold[r - 1]}` })
  roll.jet.forEach(r => { rolls = `${rolls} ${state.emoji.jet[r - 1]}` })

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
    interpretNamedealer(roll, player),
    interpretFatedHero(roll, player)
  ].filter(l => l !== null)
  msg.reply(reply.join('\n'))
}

/**
 * Parse a roll command.
 * @param msg {!Message} - The Discord.js message object that we're answering.
 * @param state {!State} - An object with the current state of play.
 */

const parseRoll = (msg, state) => {
  const m = msg.content.toLowerCase()
  let gold = 0
  let jet = 0

  const shorthand = m.match(/^roll (\d*[g|j])\s*(\d*[g|j])$/i)
  if (shorthand && Array.isArray(shorthand) && shorthand.length === 3) {
    const first = shorthand[1].charAt(shorthand[1].length - 1)
    const second = shorthand[2].charAt(shorthand[1].length - 1)
    if ((first === 'g' && second === 'j') || (first === 'j' && second === 'g')) {
      const g = first === 'g'
        ? parseInt(shorthand[1].substr(0, shorthand[1].length - 1))
        : parseInt(shorthand[2].substr(0, shorthand[2].length - 1))
      const j = first === 'j'
        ? parseInt(shorthand[1].substr(0, shorthand[1].length - 1))
        : parseInt(shorthand[2].substr(0, shorthand[2].length - 1))
      if (!isNaN(g)) gold = g
      if (!isNaN(j)) jet = j
    }
  }

  if (gold === 0 || jet === 0) {
    const jetMatch = m.match(/(\d+) (dice of )?(of )?jet/i)
    const jetParse = jetMatch && jetMatch.length > 1 ? parseInt(jetMatch[1]) : undefined
    jet = !jetParse || isNaN(jetParse) ? 0 : jetParse

    const goldMatch = m.match(/(\d+) (dice of )?(of )?gold/i)
    const goldParse = goldMatch && goldMatch.length > 1 ? parseInt(goldMatch[1]) : undefined
    gold = !goldParse || isNaN(goldParse) ? 0 : goldParse
  }

  if (jet + gold > 0) {
    interpret(msg, state, roll(gold, jet))
  }
}

module.exports = parseRoll
