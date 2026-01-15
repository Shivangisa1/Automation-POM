import { test, expect } from '@playwright/test';

test('Test case 1: Validate the contents in DAshboard', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');
    await page.waitForLoadState('networkidle');


    const cards = page.locator('.card-body');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
        const text = await cards.nth(i).innerText();
        console.log(`Card ${i + 1}:`, text);
    }

});
