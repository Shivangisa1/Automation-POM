import { test, expect } from '@playwright/test';

//import { avinodeLogin } from '../pages/AvinodeLogin'; // if using avinode page
//import { clear } from 'console';

test('validate the creation of New Request:', async ({ page }) => {

  await page.goto('https://staging.dev-tpac.xyz/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');


  //await page.waitForLoadState('networkidle',{timeout : 5000}); - //it hangs cz it found element until network is idle and network is not idle.
  //await page.waitForLoadState('domcontentloaded');

  await page.getByRole('link', { name: 'Requests' }).click();
  //await page.getByRole('link', {name: 'All Requests'}).click();
  await page.waitForLoadState('networkidle'); // to wait for loading heavy page.
  await page.getByRole('link', { name: 'Create New Request' }).click();

  //.ma_toggleCode_view

  await page.getByRole('combobox', { name: 'Search Customer' }).click();
  await page.getByRole('combobox', { name: 'Search Customer' }).getByText('TBR TBA');
  await page.getByRole('option', { name: 'TBR TBA' }).click();

  /*await page.getByRole('combobox', { name: 'Select Notes' }).click();
  await page.getByRole('combobox', { name: 'Select Notes' }).getByTitle(' No delay (On proper time)');
  await page.getByRole('option', { name: ' No delay (On proper time)' }).click();

  //system has removed below field:-------------
  await page.selectOption('#client_type', { index: 3 }); //- operator - this can varies as per the clinet type selection.
  await page.selectOption('#broker', { index: 1 }); // operator type*/


  const service = await page.locator('#select2-service_type-container').click();
  await page.waitForSelector('.select2-results');
  // Select "Charter" option
  await page.click('.select2-results__option:has-text("Charter")');

  await page.getByLabel('Search sellers').click();
  await page.getByRole('option', { name: 'Aqua' }).click();

  await page.getByLabel('Select Flight TYpe').click();
  await page.getByRole('option', { name: 'Domestic' }).click();

  await page.locator('#deadline_date').click();
  const date = await page.locator('.ui-datepicker-calendar');
  await date.getByRole('link', { name: '30' }).click();

  await page.locator('#deadline_time').click();
  await page.locator('input[name = "deadline_time"]').fill('10:00');

  // schedule the flght :
  await page.getByText('Search Airports').first().click();
  await page.getByRole('option', { name: 'OERK, RUH (KING KHALID INTL,' }).click();

  //Destination Airport---

  await page.click('#select2-destination-airport-0-container');
  await page.fill('input.select2-search__field', 'SBJE');
  await page.waitForSelector('.select2-results__option');
  await page.click('.select2-results__option:has-text("SBJE")');


  await page.locator('input[name = "pax[]"]').click();
  await page.locator('input[name = "pax[]"]').fill('5');

  await page.locator('#departure_date').click();
  await page.getByRole('link', { name: '28' }).click();


  await page.locator('input[id="departure_time[]"]').click();
  await page.locator('input[id="departure_time[]"]').fill('10:00');

  await page.locator('#arrival_date').click();
  const arrival = await page.locator('#ui-datepicker-div')
  await arrival.getByRole('link', { name: '30' }).click();


  await page.locator('input[name = "arrival_time[]"]').click();
  await page.locator('input[name = "arrival_time[]"]').fill('10:00');

  //-----------For checkbox selection--------------------

  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await page.getByRole('button', { name: 'Save Request' }).click();
  //await page.waitForLoadState('networkidle'); 

  await page.getByText('Request created successfully').isVisible();

  // Navigate to the request detail page (replace with actual URL if needed)
  await expect(page).toHaveURL(/https:\/\/staging\.dev-tpac\.xyz\/request-detail\/\d+/); // dynamic id
  //await page.waitForLoadState('networkidle'); // to wait for loading heavy page.

  // Extract the new request ID from the URL
  const url = page.url();
  const match = url.match(/request-detail\/(\d+)/);
  const requestId = match ? match[1] : null;

  //const requestId = url.split('/').pop();

  console.log('New Request ID:', requestId);// print request id in console.

  // Optional: Assert the request ID is not null
  expect(requestId).not.toBeNull();

  /* auto deletion of rceords----
    setTimeout(async () => {
      try {
        await request.delete(`/api/requests/${requestId}`);
        console.log(`🗑️ Auto-deleted record ${requestId} after 10 minutes`);
      } catch (err) {
        console.error(`❌ Failed to delete record ${requestId}`, err);
      }
    }, 10 * 60 * 1000); // 10 minutes in ms */


  //------------ ADD HANDLERS--------------
  await page.getByRole('link', { name: 'Add Handlers' }).first().click();
  await page.locator('#flexCheckDefault_0').check();
  await page.getByRole('checkbox', { name: 'Royal Terminal Ruh', exact: true }).check();
  await page.locator('#flexCheckDefault_3').check();
  await page.getByRole('button', { name: 'Add Handlers' }).click();

  await page.click('a.addNewHandlersBtn[data-id="3"]');
  await page.locator('#flexCheckDefault_0').check();
  await page.getByRole('checkbox', { name: 'SBJE Handlers', exact: true }).check();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Add Handlers' }).click();


  // ---------------------------START PROCESS---------------------------------
  const start = await page.locator('.start_proccess-btnWrapper a');
  console.log("start process button is :", start);
  await start.click();
  //await page.locator('input [id="start-process"]').click({timeout : 3000});



  //LEG ADDITION----------------
  await page.click('#select2-leg_select-container');
  await page.locator('.select2-results__option').first().click();
  await page.locator('#add_leg_btn').click(); // by id we detect DOM element.

  await page.locator('section').filter({ hasText: 'Aircraft/Operators (0) Leg 1' }).click();
  await page.getByRole('link', { name: 'Add New' }).click();

  /*
  //-------AVINODE SEARCH------------------
  await page.getByRole('link', { name: 'Search in Avinode' }).click();
  await page.getByRole('button', { name: 'Search' }).first().click();
  
  await avinodeLogin(page);
   
  await expect(page).toHaveTitle(/Avinode Marketplace/);
  
  //const icons = await page.$$('#avi-icon-success-hollow');
  //await icons[0].click();
  //await icons[1].click();
  
  const firstIcon = page.locator('svg[data-testid="IconAccept"]').first();
  
  await expect(firstIcon).toBeVisible();
  await firstIcon.click();
  await expect(page).toHaveURL(/.*\/marketplace\/mvc\/trips\/buying\/.*/

  /*
  //--------- Capture TripID from URL --------------------//
    const url1 = page.url();
    const tripIdMatch = url.match(/buying\/([^/]+)/);
    const tripId = tripIdMatch ? tripIdMatch[1] : null;
    console.log("Captured TripID:", tripId);
  
    // Assert we landed correctly
    await expect(page).toHaveTitle(/Avinode/);
    await expect(page.getByRole('heading', { name: 'Buying' })).toBeVisible();
  
    // ✅ Example: Use TripID later
    // Verify it appears in the page content
    await expect(page.getByText(tripId!)).toBeVisible();
  
    // Example: Click "Rerun Search" button
    await page.getByRole('button', { name: 'Rerun Search' }).click();
  
    // (Add more actions/assertions here)
  }); */

});






