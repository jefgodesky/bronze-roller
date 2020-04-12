const random = require('random')

/**
 * Choose a random element from an array.
 * @param arr {Array} - The array to choose a random element from.
 * @returns {*} - A random element from the array, or `undefined` if you pass
 *   it an empty array or something that isn't an array at all.
 */

const randomElement = arr => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[random.int(0, arr.length - 1)]
  } else {
    return undefined
  }
}

module.exports = { randomElement }
