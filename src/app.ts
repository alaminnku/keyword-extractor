import puppeteer from 'puppeteer';
import { endsWithExcludedWord, startsWithExcludedWord } from './utils';

// Extract keyword from URL
export async function extractKeywordsFromURL(url: string) {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
      defaultViewport: { width: 1024, height: 1600 },
    });

    // Create page
    const page = await browser.newPage();

    // Go to the homepage
    await page.goto(url, { timeout: 0 });

    // Extract data from each page
    const data = await page.evaluate(() => {
      // Get title
      const title = document
        .querySelector<HTMLTitleElement>('head > title')
        ?.textContent?.trim();

      // Get description
      const description = document
        .querySelector<HTMLMetaElement>('head > meta[name="description"')
        ?.content.trim();

      // Get keywords
      const keywords = document
        .querySelector<HTMLMetaElement>('head > meta[name="keywords"')
        ?.content.trim();

      // Headings, alt tags and link titles
      const alts: string[] = [];
      const heading1: string[] = [];
      const heading2: string[] = [];
      const heading3: string[] = [];

      // Get heading 1
      document
        .querySelectorAll('h1')
        .forEach((element) => heading1.push(element.textContent?.trim() || ''));

      // Get heading 2
      document
        .querySelectorAll('h2')
        .forEach((element) => heading2.push(element.textContent?.trim() || ''));

      // Get heading 3
      document
        .querySelectorAll('h3')
        .forEach((element) => heading3.push(element.textContent?.trim() || ''));

      // Get alts
      document
        .querySelectorAll('img')
        .forEach((element) =>
          alts.push(element.getAttribute('alt')?.trim() || '')
        );

      // Return data
      return {
        title: title || '',
        alts: alts.toString(),
        keywords: keywords || '',
        heading3: heading3.toString(),
        heading2: heading2.toString(),
        heading1: heading1.toString(),
        description: description || '',
      };
    });

    // Destructure data
    const { alts, title, keywords, heading1, heading2, heading3, description } =
      data;

    // Create a string with page data
    const pageData = `${title} ${description} ${keywords} ${heading1} ${heading2} ${heading3} ${alts}`;

    // Extract keyword from page data
    const extractedKeywords = extractKeywordsFromText(pageData);

    // Return the keywords
    return extractedKeywords;
  } catch (err) {
    // Log error
    console.log(err);
  }
}

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
