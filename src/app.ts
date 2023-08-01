import puppeteer from 'puppeteer';

interface IPhrases {
  [key: string]: number;
}

// Get most frequent phrases
function getMostFrequentPhrases(input: string, outputCount: number) {
  // Remove everything that's not a word or a white space
  // convert the text to lower case
  const cleanedText = input.replace(/[^\w\s]/g, '').toLowerCase();

  // Create array of words
  // Split by one or more white space
  const words = cleanedText.split(/\s+/);

  // Create phrases object
  let phrases: IPhrases = {};

  // Loop through the words
  for (let i = 0; i < words.length; i++) {
    // For each word create a phrase that is 2-3 words long
    for (let j = 2; j <= 3; j++) {
      // Create a phrase
      const phrase = words
        .slice(i, i + j)
        .join(' ')
        .trim();

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
      // Remove phrases that are smaller than 4 characters
      .filter((phrase) => phrase.length > 4)
      // Get a certain number of phrases
      .slice(0, outputCount)
  );
}

// Extract keyword
async function extractKeywords(url: string, outputCount: number) {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
      defaultViewport: { width: 1024, height: 1600 },
    });

    // Create page
    const page = await browser.newPage();

    // Go to the URL
    await page.goto(url, { timeout: 0 });

    // Extract data from the page
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

      // Headings
      const heading: string[] = [];

      // Get heading
      document
        .querySelectorAll('h1')
        .forEach((element) => heading.push(element.textContent?.trim() || ''));

      // Return data
      return {
        title,
        keywords,
        heading,
        description,
      };
    });

    // Create input
    const input = `${data.title} ${data.keywords} ${data.description} ${data.heading}`;

    // Get most frequently used phrases
    const mostFrequentlyUsedPhrases = getMostFrequentPhrases(
      input,
      outputCount
    );

    // Log and return the phrases
    console.log(mostFrequentlyUsedPhrases);
    return mostFrequentlyUsedPhrases;
  } catch (err) {
    // Log error
    console.log(err);
  }
}

// Call the function with:
// the URL
// output count

// extractKeywords('https://www.octib.com/', 2);
extractKeywords('https://sporkbytes.com/', 3);
// extractKeywords('https://drinklmnt.com/', 3);
// extractKeywords('https://backlinko.com/', 4);
// extractKeywords('https://herbalvineyards.com/', 3);
// extractKeywords('https://www.traversymedia.com/', 3);
// extractKeywords('https://studywebdevelopment.com/', 3);
