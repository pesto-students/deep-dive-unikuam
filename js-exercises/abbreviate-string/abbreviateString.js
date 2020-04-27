const SENTENCE_SUFFIX = '.';
const SINGLE_WORD_SUFFIX = '...';
const SINGLE_WORD_LIMIT_FOR_ABBREV = 15;

function abbreviateString(givenString) {
  if (typeof givenString !== 'string') {
    throw new TypeError(`Expected fuction parameter of string type, got ${typeof givenString}`);
  }
  let containsSpace = /[\s]+/.test(givenString);
  if (!containsSpace) {
    if (givenString.length > SINGLE_WORD_LIMIT_FOR_ABBREV)
      return `${givenString.slice(0, SINGLE_WORD_LIMIT_FOR_ABBREV)}${SINGLE_WORD_SUFFIX}`;
    else return givenString;
  }
  const arrayString = givenString.split(/[\s]+/);
  return `${arrayString[0]} ${arrayString[arrayString.length - 1][0].toUpperCase()}${SENTENCE_SUFFIX}`;
}
export {
  abbreviateString
};
