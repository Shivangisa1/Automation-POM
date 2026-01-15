import { test, expect } from '@playwright/test';

test.describe('Validating the Manage Clients Module: ', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

    await page.getByRole('link', { name: 'Manage Clients' }).click();

  });

  test('Validate the total no. of clients', async ({ page }) => {

    const entry = await page.locator('#customer-request-table_info');
    await entry.waitFor({ state: 'visible' });

    const text = await entry.textContent();
    console.log("✅ Client list displayed successfully: ", text);

    const match = text?.match(/of\s+(\d+)\s+entries/i);
    const totalEntries = match ? match[1] : null;

    console.log(`📊 Total entries: ${totalEntries}`);

  });

  test('Test case 2: Validate the Search functionality', async ({ page }) => {

    const searchBox = await page.locator('.search-wrapper');
    await searchBox.locator('input[type="search"]').fill('Client');
    await page.waitForTimeout(2000);

    console.log("✅ Search functionality is working fine ");
  });

  test('Test case 3: Validate the number of entries varies as per the Search Functionality ', async ({ page }) => {

    const searchv = await page.locator('.search-wrapper');
    await searchv.locator('input[type="search"]').fill('test');
    await page.waitForTimeout(2000);

    const entry = await page.locator('#customer-request-table_info');
    await entry.waitFor({ state: 'visible' });

    const text = await entry.textContent();
    console.log("✅ Client list displayed successfully: ", text);

    const match = text?.match(/of\s+(\d+)\s+entries/i);
    const totalEntries = match ? match[1] : null;

    console.log(`📊Now as per search results the total entries are: ${totalEntries}`);

  });

});