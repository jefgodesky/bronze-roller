const random = require('random')
const { randomElement } = require('./utils')
const well = [ 'a', 'ba', 'dim', 'e', 'fa', 'gal', 'ha', 'il', 'ka', 'la', 'ad', 'bar', 'du', 'en', 'fil', 'gil', 'hu', 'ir', 'kal', 'lab', 'ak', 'bi', 'dak', 'eb', 'fash', 'gish', 'hab', 'ib', 'kin', 'lil', 'al', 'bur', 'dal', 'el', 'feb', 'gu', 'hamin', 'ku', 'lim', 'ar', 'bab', 'dar', 'esh', 'fal', 'gub', 'haf', 'ish', 'kur', 'lu', 'as', 'bash', 'dab', 'eg', 'fur', 'gash', 'hi', 'ig', 'kab', 'lug', 'ash', 'bal', 'dash', 'ek', 'fam', 'gab', 'hish', 'id', 'kam', 'lum', 'ma', 'na', 'pa', 'ra', 'sar', 'ti', 'ush', 'ya', 'zi', 'mard', 'nam', 'pash', 'ri', 'sha', 'tu', 'uk', 'yush', 'zkur', 'mat', 'ne', 'pum', 'rim', 'shu', 'tab', 'un', 'yab', 'zub', 'mni', 'nu', 'par', 'ru', 'siz', 'tash', 'ub', 'yat', 'zash', 'mu', 'nash', 'peh', 'rab', 'sab', 'tul', 'ul', 'yeh', 'zur', 'mum', 'neb', 'pab', 'ram', 'shab', 'tam', 'ut', 'yun', 'zo', 'mesh', 'nir', 'paz', 'rur', 'shul', 'tal', 'ush', 'yog', 'zesh' ]

/**
 * Creates a random 1- to 3-syllable name, using the Well of Names.
 * @returns {string} - A random name.
 */

const randomName = () => {
  const numSyllables = random.int(1, 2)
  const syllables = []
  for (let i = 0; i <= numSyllables; i++) syllables.push(randomElement(well))
  const name = syllables.join('')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

module.exports = { randomName }
