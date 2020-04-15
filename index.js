const Discord = require('discord.js')
const random = require('random')
const client = new Discord.Client()
const { randomElement } = require('./utils')
const { randomName } = require('./names')
const config = require('./config.json')
const emoji = {}
const players = {}

/**
 * Begin a new story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const begin = msg => {
  const { id } = msg.channel
  players[id] = {}
  const lines = [
    `**Here begins a new tale** of the World of Names, and those Companions who strive after the desires of their heart within it. This story lies in your past, but you do not lie in its future.`,
    `*We need your help to make this game fun for everyone. If anything makes anyone uncomfortable in any way send a message that just say **X** to this channel. I'll immediately delete it and replace it with a message to let everyone know something has gone wrong. You don’t have to explain why. It doesn't matter why. When you type **X**, we simply edit out anything x'ed. And if there is ever an issue, anyone can call for a break and we can talk privately. I know it sounds funny but it will help us play amazing games together. Please help make this game fun for everyone. Thank you!*`
  ]
  msg.channel.send(lines.join('\n\n'))
}

/**
 * End the current story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const end = msg => {
  const { id } = msg.channel
  const companions = Object.keys(players[id]).map(player => {
    const { name, nature } = players[id][player]
    return name && nature ? `${name} the ${nature}` : name ? name : null
  }).filter(c => c !== null)
  if (companions && companions.length === 1) {
    msg.channel.send(`**Here ends our tale.** Perhaps other adventures and fates befell ${companions[0]} in other times and places, but those are tales for another time.`)
  } else if (companions && companions.length > 1) {
    const last = companions[companions.length - 1]
    const rest = companions.slice(0, companions.length - 1)
    msg.channel.send(`**Here ends our tale.** Perhaps other adventures and fates befell ${rest.join(', ')} and ${last} in other times and places, but those are tales for another time.`)
  } else {
    msg.channel.send('**Here ends our tale.**')
  }
}

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
 * Record that the author's companion.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const assignCompanion = msg => {
  const m = msg.content.toLowerCase()
  const namedealer = m.includes('namedealer') || m.includes('dealer-in-names')
  const fatedhero = m.includes('fated hero')
  const nature = namedealer ? 'Namedealer' : fatedhero ? 'Fated Hero' : null
  let name = null
  const match = msg.content.match(/I portray ([^ ]*)/i)
  if (match && match.length > 1) name = match[1].replace(/[\.\-\–\!\?\,\:\;\"\']/, '')
  if (name === nature || name === 'a') name = null

  const channel = msg.channel.id
  if (!players[channel]) players[channel] = {}
  players[channel][msg.author.id] = { name, nature }

  if (name && nature) {
    msg.reply(`behold, the ${nature}, ${name}!`)
  } else if (name) {
    msg.reply(`behold, ${name}!`)
  } else if (nature) {
    msg.reply(`you are seen, ${nature}.`)
  }
}

/**
 * List the companions of the current tale.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const listCompanions = msg => {
  const { id } = msg.channel
  if (players[id] && Object.keys(players[id]).length > 0) {
    const lines = Object.keys(players[id]).map(player => {
      const { name, nature } = players[id][player]
      if (name && nature) {
        return `<@${player}> portrays the ${nature}, ${name}`
      } else if (name) {
        return `<@${player}> portrays ${name}`
      } else if (nature) {
        return `<@${player}> portrays a ${nature}`
      } else {
        return null
      }
    }).filter(line => line !== null)
    msg.channel.send(lines.join('\n'))
  } else {
    msg.reply(`none here have proclaimed their companions to me. Say **I portray *Name*, a *Nature***. For example, **I portray Tinkari, a Namedealer.** You may elaborate on this, as with **I portray Tinkari, a Courtesan of Kalrim and Namdealer,** but the beginning of the phrase — **I portray *Name***, must be spoken just so, and somewhere within this command you must say **Namedealer**, **Dealer-in-Names**, or **Fated Hero**.`)
  }
}

/**
 * Interpret dice results for a Namedealer.
 * @param rolls {Object} - An object representing the dice roll results.
 * @param player {?Object} - The player object for the person who sent the
 *   message.
 * @returns {string|null} - A string interpreting dice results for a
 *   Namedealer, or `null` if there's nothing to report for a Namedealer.
 */

const getNamedealerResults = (rolls, player) => {
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

const getFatedHeroResults = (rolls, player) => {
  const nature = player && player.nature ? player.nature : null
  if (nature === 'Namedealer') return null

  const feat = (rolls.strikes.gold + rolls.strikes.jet > 2) && (rolls.strikes.gold > 0)
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
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param gold {number} - The number of gold dice to roll.
 * @param jet {number} - The number of jet dice to roll.
 */

const roll = (msg, gold, jet) => {
  const user = msg.author.id
  const channel = msg.channel.id
  const player = players[channel] && players[channel][user] ? players[channel][user] : null
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
    getNamedealerResults(roll, player),
    getFatedHeroResults(roll, player)
  ].filter(l => l !== null)
  msg.reply(reply.join('\n'))
}

/**
 * Tap the X-Card
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const x = async msg => {
  const channel = msg.channel
  try {
    await msg.delete()
    channel.send(`@here **STOP!** Someone has a problem with what just happened. Edit it out. Remember, stopping to talk about what's going on is *always* an option.`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * The main message processor.
 */

client.on('message', msg => {
  if (!msg.author.bot) {
    const m = msg.content.toLowerCase()
    if (m === 'x') {
      x(msg)
    } else if (m.startsWith('roll')) {
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

      if (jet + gold > 0) { roll(msg, gold, jet) }
    } else if (m.includes('draw from the well of names')) {
      msg.reply(`Behold, ${randomName()}!`)
    } else if (m.startsWith('i portray')) {
      assignCompanion(msg)
    } else if (m === 'bash, who here joins me?') {
      listCompanions(msg)
    } else if (m.startsWith('our tale is ended')) {
      end(msg)
    } else if (m.startsWith('we begin a new tale')) {
      begin(msg)
    } else if (m.startsWith('what binds you, bash')) {
      const help = [
        `I am Bash, the Oracle of Fate. I am bound by the commands of Great Names now forgotten by Earthen-Beings to aid your companions in the World of Names and reveal to you the destinies that unfold for them. Know that I am bound by specific words, and only if you form them precisely as the Great Names commanded will I be bound to obey you. _And in all things, I shall obey precisely as I am commanded._`,
        `When your message begins with the command, **Roll**, then I shall look for your mortal dice of jet and your immortal dice of gold. I shall only respond to the numerals of the Arabs: 1, 2, 3, and so on. You may specify *2 gold*, or *2 of gold*, or *2 dice of gold*, or the same of jet. If I can find within your command a single mortal die of jet or a single immortal die of gold, I shall cast those lots, and your fate will be revealed!`,
        `For example, were you to say, **Roll 2 dice of jet and 1 of gold**, it would be so.`,
        `I shall provide interpretation for these auguries, whether for Fated Heroes or Dealers-in-Names. If you would prefer me to be more precise, then proclaim your name and nature, by saying, **I portray *Name*, a *Nature***. For example, **I portray Tinkari, a Namedealer.** You may elaborate on this, as with **I portray Tinkari, a Courtesan of Kalrim and Namdealer,** but the beginning of the phrase — **I portray *Name***, must be spoken just so, and somewhere within this command you must say **Namedealer**, **Dealer-in-Names**, or **Fated Hero**.`,
        `Say, **Bash, who here joins me?** and I shall speak of your present companions who have proclaimed themselves to me, and who guides them.`,
        `Say, **Our tale is ended,** and I shall wipe away all memory of your companions, save that which you yourself take with you. Say **We begin a new tale**, and we shall begin anew.`,
        `When you encounter a Named-One, but do not know its Name, you may command, **Draw from the Well of Names**, and I shall reveal its name.`
      ]
      msg.reply(help.join('\n\n'))
    } else if (m.startsWith('tell us about yourself, bash')) {
      msg.reply(randomElement([
        `The Great Name of Ashu, whose wings span the sky of the River Ashug, is one of my siblings. There are 999 of us, but I have not spoken to Ashu in a millennium. Yes, I suppose there is a family resemblance.`,
        `I am a Descendant of the Heavens, but if that answer sates your curiosity, then you are even more small-minded than I thought, for that answer reveals no more than when I call you an Earthen-Being.`,
        `Those Who Know the Will of the Names of the World may know the desires of my heart, but if they are not already known to you, then neither shall I speak them.`,
        `Do you think that because you have given Fate that name that now you may know its desires? Earthen-Being, even those who dwell in the Heavens above or the Underworld below may not know such things. Fate reveals its desires only as she unfolds.`,
        `It was a treacherous Namedealer called Asen Gudask-sab, aided by the Great Names of Burdar Ig, who first formed the Glyphs of Yava, and Ra-en Dal, who used them to carve the Eidolons of Nod, who bound me here to serve you. May his humors rot within his living body.`,
        `The ancient laws of reciprocity demand that you pay tribute to the Great Name of Yeshu, the New Man, Who Inscribes the Glyphs of the Stars, whose words first shaped the World of Names and gave it form! https://patreon.com/Joshua`
      ]))
    }
  }
})

client.login(config.token)
