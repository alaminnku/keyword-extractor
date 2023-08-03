import puppeteer from 'puppeteer';
import { openai } from './config/openai';
import { excludedLinkWords } from './data/excludedWords';

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

    // All pages data
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

      // Add the cleaned data to all pages data
      allPagesData.push(cleanedPageData);
    }

    // Convert array to string
    const allPagesDataString = allPagesData.toString();

    // Chunks array
    const chunks: string[] = [];

    // Chunk amount
    const chunkAmount = 500;

    // Create chunks of 500 characters
    for (let i = 0; i <= allPagesDataString.length; i += chunkAmount) {
      chunks.push(allPagesDataString.slice(i, i + chunkAmount));
    }

    // Keywords array
    const keywords: string[] = [];

    await Promise.allSettled(
      chunks.map(async (chunk) => {
        // Make request to Open AI
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `The following text is taken from a website. Extract the 3 most frequently used keywords from the text that represents the topics of the website. Do not number the keywords and make them comma separated: ${chunk}`,
            },
          ],
        });

        // Add keywords to the array
        keywords.push(response.data.choices[0].message?.content?.trim() || '');
      })
    );

    // Log and return keywords
    console.log(keywords);
    return keywords;
  } catch (err) {
    // Log error
    console.log(err);
  }
}

// Call the function with the URL
// extractKeywords('https://www.octib.com/');
// extractKeywords('https://drinklmnt.com/');
// extractKeywords('https://backlinko.com');
extractKeywords('https://herbalvineyards.com/');
// extractKeywords('https://www.traversymedia.com/');
// extractKeywords('https://studywebdevelopment.com/');
