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

// Get most frequent phrases
export function getMostFrequentPhrases(input: string) {
  // Remove everything that's not a word or a white space
  // convert the text to lower case
  const cleanedText = input.replace(/[^\w\s]/g, '').toLowerCase();

  // Create array of words
  // Split by one or more white space
  const words = cleanedText.split(/\s+/);

  // Create phrases object
  let phrases: { [key: string]: number } = {};

  // Loop through the words
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    // For each word create a phrase that is 2-3 words long
    for (
      let wordCount = wordIndex + 2;
      wordCount <= wordIndex + 3 && wordCount <= words.length;
      wordCount++
    ) {
      //   Create a phrase
      const phrase = words.slice(wordIndex, wordCount).join(' ').trim();

      // Update phrases
      phrases = { ...phrases, [phrase]: (phrases[phrase] || 0) + 1 };
    }
  }

  // Return the most frequent phrases
  return (
    Object.entries(phrases)
      // Sort the phrases by most frequency
      .sort((a, b) => b[1] - a[1])
      // Get the phrases text
      .map((element) => element[0].trim())
      // Remove phrases that are:
      // Smaller than 4 characters
      // Starts or ends with excluded words
      .filter(
        (phrase) =>
          phrase.length > 4 &&
          !startsWithExcludedWord(phrase) &&
          !endsWithExcludedWord(phrase)
      )
      // Get 5 phrases
      .slice(0, 5)
  );
}
