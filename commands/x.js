/**
 * Tap the X-Card
 * @param msg {!Message} - The Discord.js Message object.
 * @param client {!Client} - The Discord.js Client object.
 * @param state {!State} - An object detailing the current state of play.
 */

const x = async (msg, client, state) => {
  const { channel, author } = msg
  const isDM = channel.constructor.name === 'DMChannel'
  if (isDM) {
    const channels = state.findChannelsWithPlayer(author.id)
    if (channels.length > 0) {
      for (const id of channels) {
        const channel = await client.channels.fetch(id)
        channel.send('@here **STOP!** The thing that just happened has been **X**\'d. Edit it out. If there is an issue, anyone can call for a break and we can talk privately.')
      }
    } else {
      msg.reply('My apologies, but I could not find any channel where you portray a companion. You must proclaim your companion in a tale by saying **I portray NAME** (for example, **I portray Tinkari** or **I portray Tinkari the Namedealer** or even **I portray Tinker the Namedealer, a Courtesan of Kalrim**). Then I will know where you play, and where to send my message.')
    }
  }
}

module.exports = x
