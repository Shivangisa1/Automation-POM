import { test, expect, Page } from '@playwright/test';

test.describe('Validating the New Changes in Tpac Project: ', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('https://staging.dev-tpac.xyz/');
        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');


    });

    test('Test case 1: Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log('Two requests were: request-detail/510 and request-detail/447 ');

    });

    test('Test case 2: Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log(' View request --  aircraft table-> aircraft box has been changed')

    });

    test('Test case 3: Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log(' start process for a trip has been changed');
    });

    test('Test case 4: Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log(' Request has a separate independent link now');
    });

    test('Test case 5: Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log(' modal windows has been changed now');
    });

    test('Test :case 6 Validate the Flight Briefing is generated successfully', async ({ page }) => {
        console.log(' Search Aircraft in create aircraft table has been changed');
    });

});