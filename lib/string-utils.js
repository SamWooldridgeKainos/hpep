// Converts a string to Sentence case
const toSentenceCase = (str) => {
  const humanCaseStr = str.replace(/[\s_]/g, ' ');
  return humanCaseStr.charAt(0).toUpperCase() + humanCaseStr.slice(1);
}

// Converts a string to PascalCase
const toPascalCase = (str) => {
  return str.split(/[\s_]/)
    .map(txt => txt.charAt(0).toUpperCase() + txt.slice(1))
    .join('');
}

// Converts a string from PascalCase/camelCase to skewer-case
const toSkewerCase = (str) => {
  return str.split('').map((letter, id) => {
    if (letter.toUpperCase() === letter) {
      return `${id !== 0 ? '-' : ''}${letter.toLowerCase()}`
    } else {
      return letter
    }
  }).join('');
}

module.exports = {
  toSentenceCase,
  toPascalCase,
  toSkewerCase
}
