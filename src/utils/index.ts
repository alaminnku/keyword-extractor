import { excludedWords } from '../data/excludedWords';

// Check if a phrase starts with an excluded words
export const startsWithExcludedWord = (phrase: string) =>
  excludedWords.includes(phrase.split(' ')[0]?.trim());

// Check if a phrase ends with an excluded words
export const endsWithExcludedWord = (phrase: string) => {
  // Create words array
  const words = phrase.split(' ');

  // Return status
  return excludedWords.includes(words[words.length - 1]?.trim());
};
