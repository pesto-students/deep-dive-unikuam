const DefaultSingleWordLimitForAbbrev = 15;
const DefaultSentenceSuffix = '.';
const DefaultSingleWordSuffix = '...';

function abbreviateString(...abbrevationStringParams) {
  const givenString = abbrevationStringParams[0];
  const sentenceSuffix = typeof abbrevationStringParams[1] != 'undefined' ? abbrevationStringParams[1] : DefaultSentenceSuffix;
  const singleWordSuffix = typeof abbrevationStringParams[2] != 'undefined' ? abbrevationStringParams[2] : DefaultSingleWordSuffix;
  const singleWordLimitForAbbrev = typeof abbrevationStringParams[3] != 'undefined' ? abbrevationStringParams[3] : DefaultSingleWordLimitForAbbrev;
  const whitespaces = /[\s]+/;
  checkForInvalidParameters(singleWordLimitForAbbrev, givenString);
  let containsWhitespaces = whitespaces.test(givenString);
  if (!containsWhitespaces) {
    if (givenString.length > singleWordLimitForAbbrev) {
      return `${givenString.slice(0, singleWordLimitForAbbrev)}${singleWordSuffix}`;
    } else {
      return givenString;
    }
  }
  const arrayString = givenString.split(whitespaces);
  const firstWord = arrayString[0];
  const lastWord = arrayString[arrayString.length - 1][0].toUpperCase();
  return `${firstWord} ${lastWord}${sentenceSuffix}`;
}

function checkForInvalidParameters(...values) {
  const singleWordLimitForAbbrev = values[0];
  const givenString = values[1];
  if (typeof singleWordLimitForAbbrev != 'number') {
    throw new TypeError(`Expected fourth parameter of number type, got ${typeof singleWordLimitForAbbrev}`);
  } else if (!Number.isFinite(singleWordLimitForAbbrev)) {
    throw new TypeError(`Expected fourth parameter a finite number, got infinit number`);
  }
  if (typeof givenString !== 'string') {
    throw new TypeError(`Expected fuction parameter of string type, got ${typeof givenString}`);
  }
}
export {
  abbreviateString
};
