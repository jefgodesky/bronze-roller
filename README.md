# Bronze Roller

This is a Discord bot that rolls dice for Joshua A.C. Newman's tabletop roleplaying game, _The Bloody-Handed Name of Bronze_. It rolls your mortal dice of jet and your immortal dice of gold. You can invite it to your server by using this link:

**[https://discordapp.com/oauth2/authorize?client_id=698552167283425431&scope=bot](https://discordapp.com/oauth2/authorize?client_id=698552167283425431&scope=bot)**

The bot tries to parse any message that starts with the word `Roll`. It looks for *X jet* or *X of jet* or *X dice of jet* (and the same for *gold*), and tries to find an Arabic numeral value for *X*. If it can find that for jet and/or gold, it will roll those dice. For example, you could type **Roll 2 dice of jet, and 2 of gold**.

By default, it will interpret those results for both Namedealers and Fated Heroes, so you might want to say `I portray a Namedealer` or `My companion is a Namedealer`, or `I portray a Fated Hero` or `My companion is a Fated Hero`. The bot will remember that and then only show you the interpretation for your companion's nature.

As a helpful and somewhat unrelated utility, you can also say, `Give me a random name`, and it will generate a random name by picking one or two elements randomly from the Well of Names.

You can bring up this information in any channel that the bot is running by sening the message `brhelp`.

If you're enjoying _The Bloody-Handed Name of Bronze_, consider supporting its creator, Joshua A.C. Newman, on Patreon: http://patreon.com/Joshua
