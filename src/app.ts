// Skip words
const skipWords = [
  'the',
  'is',
  'and',
  'a',
  'an',
  'in',
  'on',
  'of',
  'for',
  'to',
  'by',
  'with',
  'from',
  'at',
  'as',
  'about',
  'or',
  'if',
  'it',
  'how',
  'what',
  'why',
  'when',
  'who',
  'where',
  'which',
  'their',
  'his',
  'her',
  'its',
  'yours',
  'mine',
  'theirs',
  'ours',
  'my',
  'your',
  'we',
  'they',
  'our',
  'i',
  'you',
  'me',
  'him',
  'us',
  'them',
  'myself',
  'yourself',
  'himself',
  'herself',
  'itself',
  'ourselves',
  'themselves',
  'this',
  'that',
  'these',
  'those',
  'each',
  'every',
  'all',
  'any',
  'some',
  'be',
  'have',
  'do',
  'can',
  'will',
  'should',
  'would',
  'could',
  'may',
  'might',
  'must',
  'shall',
  'not',
  'no',
  'yes',
  'am',
  'are',
  'was',
  'were',
  'has',
  'had',
  'does',
  'did',
  "can't",
  "won't",
  "shouldn't",
  "wouldn't",
  "couldn't",
  "mustn't",
  "shan't",
  'cannot',
  "it's",
  "i'm",
  "you're",
  "he's",
  "she's",
  "we're",
  "they're",
  "that's",
  'there',
  'here',
  'thus',
  'hence',
  'since',
  'while',
  'after',
  'before',
  'until',
  'although',
  'because',
  'unless',
  'beside',
  'beyond',
  'among',
  'within',
  'upon',
  'underneath',
  'around',
  'behind',
  'between',
  'through',
  'below',
  'beneath',
  'above',
  'over',
  'under',
  'into',
  'onto',
  'amid',
  'amidst',
  'across',
  'against',
  'along',
  'atop',
  'down',
  'during',
  'inside',
  'near',
  'off',
  'out',
  'outside',
  'past',
  'throughout',
  'toward',
  'up',
  'without',
  'being',
  'becoming',
  'both',
  'either',
  'even',
  'else',
  'neither',
  'only',
  'otherwise',
  'quite',
  'rather',
  'somewhat',
  'such',
  'so',
  'too',
  'very',
  'own',
  'anybody',
  'anyone',
  'anything',
  'everybody',
  'everyone',
  'everything',
  'nobody',
  'no one',
  'nothing',
  'none',
  'somebody',
  'someone',
  'something',
  'several',
  'few',
  'many',
  'most',
  'much',
  'little',
  'more',
  'less',
  'least',
  'enough',
  'again',
  'also',
  'besides',
  'furthermore',
  'moreover',
  'therefore',
  'however',
  'nevertheless',
  'nonetheless',
  'still',
  'first',
  'second',
  'third',
  'last',
  'next',
  'then',
  'finally',
  'ok',
  'fine',
  'please',
  'sorry',
  'thanks',
  'welcome',
  'alongside',
  'unlike',
  'amongst',
  'including',
  'like',
  'but',
  'yet',
  'nor',
  'once',
  'whether',
  'despite',
  'though',
  'wherever',
  'whereas',
  'lest',
  'provided',
  'providing',
  'except',
  'than',
];

// Check if a phrase starts with an excluded words
const startsWithExcludedWord = (phrase: string) =>
  skipWords.includes(phrase.split(' ')[0]?.trim());

// Check if a phrase ends with an excluded words
const endsWithExcludedWord = (phrase: string) => {
  // Create words array
  const words = phrase.split(' ');

  // Return status
  return skipWords.includes(words[words.length - 1]?.trim());
};

// Extract keywords from Text
export function extractKeywordsFromText(input: string) {
  // Remove everything that's not a word or a white space
  // and convert the text to lower case
  const cleanedText = input.replace(/[^\w\s]/g, '').toLowerCase();

  // Create array of words
  // split by one or more white space
  const words = cleanedText.split(/\s+/);

  // Create phrases object
  let phrases: { [key: string]: number } = {};

  // Loop through the words
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    // For each word create multiple phrases
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
  return Object.entries(phrases)
    .sort((a, b) => b[1] - a[1])
    .map((element) => element[0].trim())
    .filter(
      (phrase) =>
        phrase.length > 4 &&
        !startsWithExcludedWord(phrase) &&
        !endsWithExcludedWord(phrase)
    )
    .slice(0, 5);
}
