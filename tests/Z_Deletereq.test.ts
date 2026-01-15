import { test, expect } from '@playwright/test';
import { clear } from 'console';

test('Validating the Multi-Leg Trip should be created', async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');


await page.getByRole('link', { name: 'Requests' }).click();
await page.waitForLoadState('networkidle');

 await page.locator('a[onclick^="deleteRequest"]').first().click();
 const alert= await page.locator('.ma_warningModal_wrapper').nth(1);  
 await alert.waitFor({ state: 'visible' });
 await alert.getByRole('link', { name: 'Delete ' }).click();
 console.log('Request has been deleted successfully');


});
