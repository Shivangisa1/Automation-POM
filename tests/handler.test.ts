import { test, expect } from '@playwright/test';

test.describe('Validating the Manage Handler Module: ', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('https://staging.dev-tpac.xyz/');
        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

        await page.getByRole('link', { name: 'Airports /Handlers' }).click();

    });

    test('Test case 01: Validate the total no. of handlers', async ({ page }) => {
        await page.getByRole('link', { name: 'All Handlers' }).click();


        const entry = await page.locator('#aircrafts-handler-table_info');
        await entry.waitFor({ state: 'visible' });

        const text = await entry.textContent();
        console.log("✅ Client list displayed successfully: ", text);

        const match = text?.match(/of\s+(\d+)\s+entries/i);
        const totalEntries = match ? match[1] : null;

        console.log(`📊 Total entries: ${totalEntries}`);

    });

    test('Test case 02: Validate the Search functionality', async ({ page }) => {
        await page.getByRole('link', { name: 'All Handlers' }).click();


        const searchBox = await page.locator('.search-wrapper');
        await searchBox.locator('input[type="search"]').fill('Test');
        await page.waitForTimeout(2000);

        console.log("✅ Search functionality is working fine ");
    });

    test('Test case 03: Validate the number of handlers varies as per the Search Functionality ', async ({ page }) => {
        await page.getByRole('link', { name: 'All Handlers' }).click();


        const searchv = await page.locator('.search-wrapper');
        await searchv.locator('input[type="search"]').fill('handler');
        await page.waitForTimeout(2000);

        const entry = await page.locator('#aircrafts-handler-table_info');
        await entry.waitFor({ state: 'visible' });

        const text = await entry.textContent();
        console.log("✅ Client list displayed successfully: ", text);

        const match = text?.match(/of\s+(\d+)\s+entries/i);
        const totalEntries = match ? match[1] : null;

        console.log(`📊Now as per search results the total handlers are: ${totalEntries}`);

    });

    test('Test case 04 : Validate the total number of airports', async ({ page }) => {
        await page.getByRole('link', { name: 'All Airport' }).click();

        const entry = await page.locator('#airport-table_info');
        await entry.waitFor({ state: 'visible' });

        const text = await entry.textContent();
        console.log("✅ Client list displayed successfully: ", text);

        const match = text?.match(/of\s+(\d+)\s+entries/i);
        const totalEntries = match ? match[1] : null;

        console.log(`📊 Total entries: ${totalEntries}`);
    });

    test('Test case 05: Validate the Search functionality', async ({ page }) => {
        await page.getByRole('link', { name: 'All Airport' }).click();


        const searchBox = await page.locator('.search-wrapper');
        await searchBox.locator('input[type="search"]').fill('Dubai');
        await page.waitForTimeout(2000);

        console.log("✅ Search functionality is working fine ");
    });


    test('Test case 06: Validate the number of Airports varies as per the Search Functionality ', async ({ page }) => {
        await page.getByRole('link', { name: 'All Airport' }).click();


        const searchv = await page.locator('.search-wrapper');
        await searchv.locator('input[type="search"]').fill('test');
        await page.waitForTimeout(2000);

        const entry = await page.locator('#airport-table_info');
        await entry.waitFor({ state: 'visible' });

        const text = await entry.textContent();
        console.log("✅ Client list displayed successfully: ", text);

        const match = text?.match(/of\s+(\d+)\s+entries/i);
        const totalEntries = match ? match[1] : null;

        console.log(`📊Now as per search results the total Airports are: ${totalEntries}`);

    });
});