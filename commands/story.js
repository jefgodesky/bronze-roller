/**
 * Begin a new story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param state {!State} - An object with the current state of play.
 */

const begin = (msg, state) => {
  state.reset(msg.channel.id)
  const lines = [
    `**Here begins a new tale** of the World of Names, and those Companions who strive after the desires of their heart within it. This story lies in your past, but you do not lie in its future.`,
    `*We need your help to make this game fun for everyone. If anything makes anyone uncomfortable in any way send a private message that just says **X** to me, Bash, the Oracle of Fate. I'll send a message to this channel to let everyone know something has gone wrong. You don’t have to explain why. It doesn't matter why. When you send me a private message consisting of just the letter **X**, we simply edit out anything x'ed. And if there is ever an issue, anyone can call for a break and we can talk privately. I know it sounds funny but it will help us play amazing games together. Please help make this game fun for everyone. Thank you!*`
  ]
  msg.channel.send(lines.join('\n\n'))
}

/**
 * End the current story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param state {Object} - An object with the current state of play.
 */

const end = (msg, state) => {
  const companions = state.reset(msg.channel.id).map(c => {
    const { name, nature } = c
    if (name && nature) {
      return `${name} the ${nature}`
    } else if (name) {
      return name
    } else {
      return null
    }
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
 * Record the author's companion.
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param state {Object} - An object with the current state of play.
 */

const assignCompanion = (msg, state) => {
  const m = msg.content.toLowerCase()
  const namedealer = m.includes('namedealer') || m.includes('dealer-in-names')
  const fatedhero = m.includes('fated hero')
  const nature = namedealer ? 'Namedealer' : fatedhero ? 'Fated Hero' : null
  let name = null
  const match = msg.content.match(/I portray ([^ ]*)/i)
  if (match && match.length > 1) name = match[1].replace(/[\.\-\–\!\?\,\:\;\"\']/, '')
  if (name === nature || name === 'a') name = null

  state.setPlayer(msg.channel.id, msg.author.id, name, nature)
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
 * @param state {Object} - An object with the current state of play.
 */

const listCompanions = (msg, state) => {
  const companions = state.getPlayers(msg.channel.id)
  if (companions.length > 0) {
    const lines = companions.map(c => {
      const { player, name, nature } = c
      if (name && nature) {
        return `<@${player}> portrays the ${nature}, ${name}`
      } else if (name) {
        `<@${player}> portrays ${name}`
      } else if (nature) {
        `<@${player}> portrays a ${nature}`
      } else {
        return null
      }
    }).filter(c => c !== null)
    msg.channel.send(lines.join('\n'))
  } else {
    msg.reply(`none here have proclaimed their companions to me. Say **I portray *Name*, a *Nature***. For example, **I portray Tinkari, a Namedealer.** You may elaborate on this, as with **I portray Tinkari, a Courtesan of Kalrim and Namdealer,** but the beginning of the phrase — **I portray *Name***, must be spoken just so, and somewhere within this command you must say **Namedealer**, **Dealer-in-Names**, or **Fated Hero**.`)
  }
}

module.exports = {
  begin,
  end,
  assignCompanion,
  listCompanions
}
