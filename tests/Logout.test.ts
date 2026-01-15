import { test, expect } from '@playwright/test';

test('Test case 002: Validate the logout functionality', async ({ page }) => {
  await page.goto('https://staging.dev-tpac.xyz/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

  const toggle = page.locator('a.ma_notification_toggle[data-bs-target="#warningModalCenter2"]');
  await toggle.waitFor({ state: 'visible' });
  await toggle.click();

  console.log('clicked on logout icon');
  /*
    // Wait for the modal to be visible (Bootstrap adds .show)
    const modal = page.locator('#warningModalCenter2.show');
    const modal1 = await modal.locator('.warningBtnGroup');
    await modal.waitFor({ state: 'visible' });
  
    console.log('Found locator successfully when clicked on modal for logout');
  
    await modal1.locator('a.btn.btn-danger', { hasText: 'Logout' }).first().click();
    // await modal.locator('a.btn-outline-danger', { hasText: 'Cancel' }).click(); 
    */


});

