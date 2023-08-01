import puppeteer from 'puppeteer';

// Get most frequent phrases

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

      // Headings
      const heading: string[] = [];

      // Get heading
      document
        .querySelectorAll('h1')
        .forEach((element) => heading.push(element.textContent?.trim() || ''));

      // Return data
      return {
        title,
        description,
        heading,
      };
    });

    // Create input
    const input = `${data.title} ${data.description} ${data.heading}`;

    console.log(input);
  } catch (err) {
    // Log error
    console.log(err);
  }
}

// https://drinklmnt.com/
// https://herbalvineyards.com/

extractKeywords('https://drinklmnt.com/');
