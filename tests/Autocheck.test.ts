import { test, expect } from '@playwright/test';


test.describe('Validating the Login functioanilty', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('https://staging.dev-tpac.xyz/');

    });

    test('Test Case 001: Verify that the user can Login successfully', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');
        await page.waitForLoadState('networkidle')

    });

    test('Test Case 002: Verify that the user cannot login due to incorrect email', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinatsr.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
        await page.getByRole('button', { name: 'Log In' }).click();

        const errorMsg = page.locator('li.text-danger');
        await expect(errorMsg).toHaveText('These credentials do not match our records.');
        console.log('User is not able to login due to incorrect email as');

    });


    test('Test Case 003: Verify that the user cannot login due to incorrect password', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@1234');
        await page.getByRole('button', { name: 'Log In' }).click();
        const errorMsg = page.locator('li.text-danger');
        await expect(errorMsg).toHaveText('These credentials do not match our records.');
        console.log('User is not able to login due to incorrect password');

    });

    test('Test Case 004: Verify that the user cannot login due to empty password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('');
        await page.getByRole('button', { name: 'Log In' }).click();
        console.log('User is not able to login due to empty password');

    });

    test('Test Case 005: Verify that the user cannot login due to empty email', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@1234');
        await page.getByRole('button', { name: 'Log In' }).click();
        console.log('User is not able to login due to empty email');
    });

    test('Test Case 006: Verify that the user cannot login due to incomplete email', async ({ page }) => {

        await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@1234');
        await page.getByRole('button', { name: 'Log In' }).click();
        const errorMsg = page.locator('li.text-danger');
        await expect(errorMsg).toHaveText('These credentials do not match our records.');
        console.log('User is not able to login due to incomplete email');
    });

});