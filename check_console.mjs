import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`UNCAUGHT EXCEPTION: ${error.message}`);
  });

  console.log('Visiting http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  } catch (e) {
    console.log('Could not visit 5173:', e.message);
  }

  console.log('Visiting http://localhost:5174...');
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  } catch (e) {
    console.log('Could not visit 5174:', e.message);
  }

  await browser.close();
})();
