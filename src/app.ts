import puppeteer from 'puppeteer';
import { openai } from './config/openai';
import { config } from 'dotenv';
import { excludedLinkWords } from './data/excludedWords';

// Configs
config();

// Extract keyword
async function extractKeywords(url: string) {
  // Create URL object
  const urlObject = new URL(url);

  // Get origin and host
  const host = urlObject.host;
  const origin = urlObject.origin;

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
    await page.goto(origin, { timeout: 0 });

    // Extract links from the home page
    const links = await page.evaluate(() => {
      // Links
      const links: string[] = [];

      // Get links
      document
        .querySelectorAll('a')
        .forEach((element) => links.push(element.getAttribute('href') || ''));

      // Return links
      return links;
    });

    // Format links
    const allLinks = links
      .filter((link) => link.includes(host) || link.startsWith('/'))
      .map((link) => (link.startsWith('/') ? `${origin}${link}` : link))
      .filter((link, index, links) => links.indexOf(link) === index);

    // All data
    const allPagesData: string[] = [];

    // Loop through all links
    for (let link of allLinks) {
      // Go to the link
      await page.goto(link, { timeout: 0 });

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
          .forEach((element) =>
            heading1.push(element.textContent?.trim() || '')
          );

        // Get heading 2
        document
          .querySelectorAll('h2')
          .forEach((element) =>
            heading2.push(element.textContent?.trim() || '')
          );

        // Get heading 3
        document
          .querySelectorAll('h3')
          .forEach((element) =>
            heading3.push(element.textContent?.trim() || '')
          );

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
      const {
        alts,
        title,
        keywords,
        heading1,
        heading2,
        heading3,
        description,
      } = data;

      // Split link
      const words = link.split('/');

      // Modify and get the last split value
      const linkPhrase = words[words.length - 1].replace(/-/g, ' ');

      // Check if the phrase has any excluded words
      const hasExcludedWords = excludedLinkWords.some((excludedLinkWord) =>
        linkPhrase.includes(excludedLinkWord)
      );

      // Create a string with page data
      const pageData = `${title} ${description} ${keywords} ${heading1} ${heading2} ${heading3} ${alts} ${
        !hasExcludedWords && linkPhrase
      }`;

      // Clean page data
      const cleanedPageData = pageData.replace(/[^\w\s]/g, '').toLowerCase();

      // Add the cleaned data to all data
      allPagesData.push(cleanedPageData);
    }

    // // Create chat completion
    // const response = await openai.createCompletion({
    //   model: 'gpt-3.5-turbo',
    //   prompt: `Generate 1-5 most frequently words from the following text: ${cleanedInput}`,
    // });

    // // @ts-ignore
    // console.log(response.choices[0].text.strip());
  } catch (err) {
    // Log error
    console.log(err);
  }
}

// Call the function with the URL
// extractKeywords('https://www.octib.com/');
// extractKeywords('https://drinklmnt.com/');
// extractKeywords('https://backlinko.com');
// extractKeywords('https://herbalvineyards.com/');
// extractKeywords('https://www.traversymedia.com/');
// extractKeywords('https://studywebdevelopment.com/');
