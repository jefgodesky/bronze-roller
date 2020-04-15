const { randomElement } = require('../utils')

/**
 * Chatting with Bash, Oracle of Fate.
 * @param msg {Message} - The Discord.js message object that we're answering.
 */

const personality = msg => {
  msg.reply(randomElement([
    `the Great Name of Ashu, whose wings span the sky of the River Ashug, is one of my siblings. There are 999 of us, but I have not spoken to Ashu in a millennium. Yes, I suppose there is a family resemblance.`,
    `I am a Descendant of the Heavens, but if that answer sates your curiosity, then you are even more small-minded than I thought, for that answer reveals no more than when I call you an Earthen-Being.`,
    `those Who Know the Will of the Names of the World may know the desires of my heart, but if they are not already known to you, then neither shall I speak them.`,
    `do you think that because you have given Fate that name that now you may know its desires? Earthen-Being, even those who dwell in the Heavens above or the Underworld below may not know such things. Fate reveals its desires only as she unfolds.`,
    `it was a treacherous Namedealer called Asen Gudask-sab, aided by the Great Names of Burdar Ig, who first formed the Glyphs of Yava, and Ra-en Dal, who used them to carve the Eidolons of Nod, who bound me here to serve you. May his humors rot within his living body.`,
    `the ancient laws of reciprocity demand that you pay tribute to the Great Name of Yeshu, the New Man, Who Inscribes the Glyphs of the Stars, whose words first shaped the World of Names and gave it form! https://patreon.com/Joshua`
  ]))
}

module.exports = personality
