import { selectors, messages } from '../pages/constant';
import { test, expect } from '@playwright/test';

test('Test case 001: validate error toast', async ({ page }) => {

  await page.goto('https://staging.dev-tpac.xyz/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

  await page.getByRole('link', { name: 'Requests' }).click();
  /*
await page.locator(selectors.createCbrButton).click();
const toastText = await page.locator(selectors.toastMessage).innerText();
console.log('Error:', toastText);
expect(toastText).toContain(messages.bankMandatory); */
});
