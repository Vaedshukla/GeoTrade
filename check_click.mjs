import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}] ${msg.text()}`);
  });

  try {
    console.log('Visiting http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Attempt to click the USA path in the SVG
    console.log('Clicking USA on the map...');
    const pathHandle = await page.$('path[data-country-id="USA"]');
    if (pathHandle) {
      await pathHandle.click();
      console.log('Clicked USA, waiting 5 seconds for API response...');
      await new Promise(r => setTimeout(r, 5000)); // wait for api fetch
    } else {
      console.log('No USA path found on map');
    }

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await browser.close();
  }
})();
