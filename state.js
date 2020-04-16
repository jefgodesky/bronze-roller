class State {
  constructor () {
    this.channels = {}
    this.emoji = {}
  }

  /**
   * Load emoji into state.
   * @param client {Client} - The Discord.js Client object.
   */

  loadEmoji (client) {
    const count = []
    for (let i = 1; i < 7; i++) count.push(i)
    this.emoji = {
      gold: count.map(i => client.emojis.cache.find(emoji => emoji.name === `gold${i}`)),
      jet: count.map(i => client.emojis.cache.find(emoji => emoji.name === `jet${i}`))
    }
  }

  /**
   * Return the player who sent the message, if they are a registered player in
   * the current state.
   * @param msg {Message} - The Discord.js message object.
   * @returns {Object|null} - The player object in the state or `null` if no
   *   object matches the channel and author ID provided.
   */

  getSender (msg) {
    const user = msg.author.id
    const channel = msg.channel.id
    return this.channels && this.channels[channel] && this.channels[channel][user]
      ? this.channels[channel][user]
      : null
  }

  /**
   * Return an array of players in the channel's current game.
   * @param channel {string} - The channel ID.
   * @returns {{nature: string, name: string, player: string}[]} - An array of
   *   object representing the players currently in the channel.
   */

  getPlayers (channel) {
    if (this.channels[channel]) {
      return Object.keys(this.channels[channel]).map(player => {
        const { name, nature } = this.channels[channel][player]
        return { player, name, nature }
      })
    } else {
      return []
    }
  }

  /**
   * Record a player's name and nature.
   * @param channel {string} - The ID of the channel you're playing in.
   * @param player {string} - The player's ID.
   * @param name {string} - The companion's name.
   * @param nature {string} - The companion's nature (either `Fated Hero` or
   *   `Namedealer`).
   */

  setPlayer (channel, player, name, nature) {
    if (!this.channels[channel]) this.channels[channel] = {}
    this.channels[channel][player] = { name, nature }
  }

  /**
   * Return an array of channel ID's that the player is in.
   * @param id {string} - The player ID.
   * @returns {string[]} - An array of channel ID's that the player is in.
   */

  findChannelsWithPlayer (id) {
    return Object.keys(this.channels).filter(channel => Object.keys(this.channels[channel]).includes(id))
  }

  /**
   * Reset a channel's data, but return what was in it first.
   * @param channel {string} - The ID of the channel to reset.
   * @returns {{ name: string, nature: string }[]} - An array of objects
   *   representing the players who were in the channel before it was reset.
   */

  reset (channel) {
    const tmp = this.getPlayers(channel)
    delete this.channels[channel]
    return tmp
  }
}

module.exports = State
