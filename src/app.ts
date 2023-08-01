import puppeteer from 'puppeteer';
import { getMostFrequentPhrases } from './utils';

// Extract keyword
async function extractKeywords(url: string) {
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
        title: title || '',
        keywords: keywords || '',
        heading: heading || '',
        description: description || '',
      };
    });

    // Create input
    const input = `${data.title} ${data.keywords} ${data.description} ${data.heading}`;

    // Get most frequently used phrases
    const mostFrequentlyUsedPhrases = getMostFrequentPhrases(input);

    // Log and return the phrases
    console.log(mostFrequentlyUsedPhrases);
    return mostFrequentlyUsedPhrases;
  } catch (err) {
    // Log error
    console.log(err);
  }
}

// Call the function with the URL
// extractKeywords('https://www.octib.com/');
extractKeywords('https://drinklmnt.com/');
// extractKeywords('https://backlinko.com/');
// extractKeywords('https://herbalvineyards.com/');
// extractKeywords('https://www.traversymedia.com/');
// extractKeywords('https://studywebdevelopment.com/');
