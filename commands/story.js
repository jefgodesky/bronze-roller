/**
 * Begin a new story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param state {Object} - An object with the current state of play.
 */

const begin = (msg, state) => {
  const { id } = msg.channel
  state.channels[id] = {}
  const lines = [
    `**Here begins a new tale** of the World of Names, and those Companions who strive after the desires of their heart within it. This story lies in your past, but you do not lie in its future.`,
    `*We need your help to make this game fun for everyone. If anything makes anyone uncomfortable in any way send a message that just say **X** to this channel. I'll immediately delete it and replace it with a message to let everyone know something has gone wrong. You don’t have to explain why. It doesn't matter why. When you type **X**, we simply edit out anything x'ed. And if there is ever an issue, anyone can call for a break and we can talk privately. I know it sounds funny but it will help us play amazing games together. Please help make this game fun for everyone. Thank you!*`
  ]
  msg.channel.send(lines.join('\n\n'))
}

/**
 * End the current story.
 * @param msg {Message} - The Discord.js message object that we're answering.
 * @param state {Object} - An object with the current state of play.
 */

const end = (msg, state) => {
  const { id } = msg.channel
  const companions = Object.keys(state.channels[id]).map(player => {
    const { name, nature } = state.channels[id][player]
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
  state.channels[id] = {}
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

  const channel = msg.channel.id
  if (!state.channels[channel]) state.channels[channel] = {}
  state.channels[channel][msg.author.id] = { name, nature }

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
  const { id } = msg.channel
  if (state.channels && state.channels[id] && Object.keys(state.channels[id]).length > 0) {
    const lines = Object.keys(state.channels[id]).map(player => {
      const { name, nature } = state.channels[id][player]
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

module.exports = {
  begin,
  end,
  assignCompanion,
  listCompanions
}
