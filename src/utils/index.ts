import { skipWords } from '../data/skipWords';

// Check if a phrase starts with an excluded words
export const startsWithExcludedWord = (phrase: string) =>
  skipWords.includes(phrase.split(' ')[0]?.trim());

// Check if a phrase ends with an excluded words
export const endsWithExcludedWord = (phrase: string) => {
  // Create words array
  const words = phrase.split(' ');

  // Return status
  return skipWords.includes(words[words.length - 1]?.trim());
};
