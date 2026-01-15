import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://staging.dev-tpac.xyz/');
  await page.fill('[name="email"]', 'admin@mailinator.com');
  await page.fill('[name="password"]', 'Tpac@123');
  await page.click('button:has-text("Log In")');

  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;
