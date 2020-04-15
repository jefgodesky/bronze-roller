/**
 * Tap the X-Card
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const x = async msg => {
  const channel = msg.channel
  try {
    await msg.delete()
    channel.send(`@here **STOP!** The thing that just happened has been X'd. Edit it out. Remember, stopping to talk about what's going on is *always* an option.`)
  } catch (err) {
    console.error(err)
  }
}

module.exports = x
