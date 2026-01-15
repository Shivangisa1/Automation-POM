import { test, expect } from '@playwright/test';

test('Test case 001: Validate the logout functionality', async ({ page }) => {
  await page.goto('https://staging.dev-tpac.xyz/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');
  /*

  await page.getByRole('banner').getByRole('link').nth(1).click();
  await page.locator('header div ul li:nth-child(2) a').click(); //inspect from xpath

  await page.locator('.modal-content', { hasText: 'Logout' }).getByRole('link', { name: 'Logout' }).click();
*/

});



