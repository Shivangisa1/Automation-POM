import { test, expect } from '@playwright/test';

test('Validate all buttons clickability', async ({ page }) => {

  await page.goto('https://staging.dev-tpac.xyz/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

  await page.getByRole('link', { name: 'Requests' }).click();
  //await page.getByRole('link', {name: 'All Requests'}).click();// removed it due to functionality change


  await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

  // Get all "View" buttons by their common selector or ID pattern
  //const viewButtons = await page.locator('input[id="viewAircraftOperatorDetailsBtn"]'); // all id's satrt with this similar id's------

  const viewicons1 = await page.locator('a.icon-link').count();
  console.log("total number of icons in a request are :", viewicons1);


  //for (let i = 0; i < viewicons1; i++) {

  //await page.waitForSelector('.offcanvas.show', { state: 'visible' });
  //await page.locator('button.btn-close').click();
  //await page.waitForSelector('.offcanvas.show', { state: 'detached' });

  /*
  
  for (let i = 0; i < count; i++) {
    await viewIcons.nth(i).click();
    await page.waitForSelector('.offcanvas.show', { state: 'visible' });
    await page.locator('button.btn-close').click();
    await page.waitForSelector('.offcanvas.show', { state: 'detached' });
  }
  */
  /*
    // Wait for the modal to appear
    const modal = page.locator('.modal-body');
    await modal.waitFor({ state: 'visible', timeout: 5000 });
  
    // Optionally, you can do validations inside the modal here
    // e.g., console.log(await modal.textContent());
  
    // Click the close button inside the modal
    const closeBtn =  modal.locator('button.btn-close[data-bs-dismiss="modal"]');
    await closeBtn.click();
  }
    // Wait until the modal is detached before moving to the next
    await page modal.waitFor({ state: 'detached', timeout: 5000 });
  */
});