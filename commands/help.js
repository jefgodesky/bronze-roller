/**
 * Display instructions.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const help = msg => {
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
}

module.exports = help
