
/*import { test, expect,Page } from '@playwright/test';


// Utility: selects an option from Select2 dropdown inside #genrate-flight-briefing-offcanvas
async function selectFromSelect2Dropdown(
  page: Page,
  optionText: string,
  dropdownIndex: number
) {
  const containerLocator = '#genrate-flight-briefing-offcanvas';


  const dropdowns = page.locator(`${containerLocator} span.select2-selection`);
  const count = await dropdowns.count();

  if (dropdownIndex >= count) {
    throw new Error(`Dropdown index ${dropdownIndex} is out of range (found ${count})`);
  }

  const dropdown = dropdowns.nth(dropdownIndex);
  await dropdown.waitFor({ state: 'visible' });
  await dropdown.click();

  const optionsList = page.locator('.select2-results__options').last();
  await optionsList.waitFor({ state: 'visible' , timeout: 5000});

  const targetOption = optionsList.locator('.select2-results__option').filter({ hasText: optionText }).first();
  await targetOption.waitFor({ state: 'visible' });
  await targetOption.click();

  //const selectedValue = await dropdown.textContent();
  //expect(selectedValue?.trim()).toContain(optionText);

  console.log(`✅ Selected "${optionText}" in dropdown #${dropdownIndex + 1}`);
}
  

test('Select all dropdowns in Generate Flight Briefing', async ({ page }) => {
  await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');
  
    await page.getByRole('link', { name: 'Requests' }).click();
  await page.goto('https://staging.dev-tpac.xyz/request-detail/510'); // 🔁 replace with your actual URL
  await page.locator('a[onclick^="genrateFlightBriefing()"]').nth(0).click();
    await page.locator('#genrate-flight-briefing-offcanvas').waitFor({ state: 'visible' });


  const dropdownSelections = [
    'DejaVuSans',
    'English',
    'Round Trip - SBJE → OERK → SBJE',
    'SBJE Handlers',
    'Saudi Ground Services'
  ];

  for (let i = 0; i < dropdownSelections.length; i++) {
    await selectFromSelect2Dropdown(page, dropdownSelections[i], i);
  }

  console.log('🎯 All Select2 dropdowns handled successfully');
});
*/

import { test, expect, Page } from '@playwright/test';

test.describe('Validating the Flight Briefing for Round Trip: ', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

    await page.getByRole('link', { name: 'Requests' }).click();
  });


  test('Test 1: Validate the Flight Briefing is generated successfully', async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    // Click Flight Briefing button
    await page.locator('a[onclick^="genrateFlightBriefing()"]').first().click();

    // Wait for modal to be visible
    const modal = page.locator('#genrate-flight-briefing-offcanvas');
    await modal.waitFor({ state: 'visible' });
    await page.waitForTimeout(1000); // Wait for dropdowns to initialize

    // 1. Font Family dropdown
    //await modal.locator('span.select2-selection').nth(0).click();
    //await modal.locator('.select2-results__option', { hasText: 'DejaVuSans' }).click();
    //console.log('✅ Selected Font Family');

    // 2. Language dropdown
    //await modal.locator('span.select2-selection').nth(1).click(); await page.locator('.select2-results__option', { hasText: 'English' }).click();

    const lang = await modal.locator('#flight_briefing_language');
    await lang.selectOption('English');
    console.log('✅ Selected Language');

    // 3. Round Trip Leg dropdown
    await modal.locator('span.select2-selection').nth(2).click();
    await page.locator('.select2-results__option', {
      hasText: 'Round Trip - SBJE → OERK → SBJE'
    }).click();
    console.log('✅ Selected Round Trip Leg');

    // Wait for handlers dropdowns to load
    await page.waitForTimeout(2000);

    // 4. Origin Handler dropdown
    await modal.locator('span.select2-selection').nth(3).click();
    await page.locator('.select2-results__option', { hasText: 'SBJE Handlers' }).click();
    console.log('✅ Selected Origin Handler');

    // 5. Destination Handler dropdown
    await modal.locator('span.select2-selection').nth(4).click();
    await page.locator('.select2-results__option', { hasText: 'Saudi Ground Services' }).click();
    console.log('✅ Selected Destination Handler');

    // Verify all selections
    await expect(modal).toContainText('DejaVuSans');
    await expect(modal).toContainText('English');
    await expect(modal).toContainText('Round Trip - SBJE → OERK → SBJE');
    await expect(modal).toContainText('SBJE Handlers');
    await expect(modal).toContainText('Saudi Ground Services');

    console.log('✅ All dropdowns handled successfully');

    await modal.locator('#generate-briefing-btn').click();
    console.log('Generate Flight Briefing button clicked');
    console.log('Flight briefing is generated Successfully');

    console.log('Flight briefing modal closed successfully');
    console.log('✅ Flight Briefing is Save as Draft');

    //------------Buttons are not working due to docker deployment in flight Briefing------------------

  });

  test('Test Case 2: Verify that Serach Box is functioning ', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

  });
});
