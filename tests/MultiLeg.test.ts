import { test, expect } from '@playwright/test';


test.describe('Validating the Full flow for Round Trip Request', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

    await page.getByRole('link', { name: 'Requests' }).click();

  });

  test('Test case 01: Verify that the Create new request should be clicked', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();
  });

  test('Test case 02: Verify that the Search customer is searching customers correctly ', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();

    await page.getByRole('combobox', { name: 'Search Customer' }).click();
    await page.getByRole('combobox', { name: 'Search Customer' }).getByText('TBR TBA');
    await page.getByRole('option', { name: 'TBR TBA' }).click();
  });

  test('Test case 03: Verify that the Search Notes is taking notes correctly ', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();

    await page.getByRole('combobox', { name: 'Select Notes' }).click();
    await page.getByRole('combobox', { name: 'Select Notes' }).getByTitle(' No delay (On proper time)');
    await page.getByRole('option', { name: ' No delay (On proper time)' }).click();
  });


  test('Test case 04: Verify that the Search Sellers is searching sellers correctly ', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();

    await page.getByLabel('Search sellers').click();
    await page.getByRole('option', { name: 'Aqua' }).click();
  });

  test('Test case 05: Verify that the user can select flight ', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();
    await page.getByLabel('Select Flight TYpe').click();
    await page.getByRole('option', { name: 'Domestic' }).click();
  });

  test('Test case 06: Verify that the user can set deadline date for the flight ', async ({ page }) => {
    await page.getByRole('link', { name: 'Create New Request' }).click();
    const date = await page.locator('#deadline_date');
    await date.click();
    /*
    const date1 = await date.locator('#ui-datepicker-div');
    date1.click();
    await date1.getByRole('link', { name: '30' }).click();
  });*/

    test('Test case 07: Verify that the user can set deadline time for the flight ', async ({ page }) => {
      await page.getByRole('link', { name: 'Create New Request' }).click();
      const time = await page.locator('#deadline_time');
      await time.click();
      await time.fill('10:00');
    });

    test('Test case 08: Validating the Multi-Leg Trip should be created', async ({ page }) => {

      await page.getByRole('link', { name: 'Create New Request' }).click();

      await page.getByRole('combobox', { name: 'Search Customer' }).click();
      await page.getByRole('combobox', { name: 'Search Customer' }).getByText('TBR TBA');
      await page.getByRole('option', { name: 'TBR TBA' }).click();

      await page.getByRole('combobox', { name: 'Select Notes' }).click();
      await page.getByRole('combobox', { name: 'Select Notes' }).getByTitle(' No delay (On proper time)');
      await page.getByRole('option', { name: ' No delay (On proper time)' }).click();

      await page.getByLabel('Search sellers').click();
      await page.getByRole('option', { name: 'Aqua' }).click();

      await page.getByLabel('Select Flight TYpe').click();
      await page.getByRole('option', { name: 'Domestic' }).click();

      const date = await page.locator('#deadline_date');
      await date.click();
      const date1 = await page.locator('#ui-datepicker-div');
      await date1.getByRole('link', { name: '30' }).click();

      const time = await page.locator('#deadline_time');
      await time.click();
      await time.fill('10:00');

      //-------------------SCHEDULING THE FLIGHT FOR MULTI-LEG REQUEST------------------
      // Schedule the flght :--------------
      const schedule = await page.locator('.tpac_handover--wrapper tpac_requestTables--wrapper');
      await page.getByText('Search Airports').first().click();
      await page.getByRole('option', { name: 'SBJE, JJD (COMDT. ARISTON PESSOA, CRUZ, BR)' }).click();

      //Destination Airport------------
      await page.click('#select2-destination-airport-0-container');
      await page.fill('input.select2-search__field', 'OMDB');
      await page.waitForSelector('.select2-results__option');
      await page.click('.select2-results__option:has-text("OMDB")');

      await page.locator('input[name = "pax[]"]').click();
      await page.locator('input[name = "pax[]"]').fill('5');

      await page.locator('#departure_date').click();
      await page.getByRole('link', { name: /^7$/ }).click(); //use regex for single digit date


      await page.locator('input[id="departure_time[]"]').click();
      await page.locator('input[id="departure_time[]"]').fill('10:00');

      await page.locator('#arrival_date').click();
      await page.getByRole('link', { name: /^8$/ }).click();


      await page.locator('input[name = "arrival_time[]"]').click();
      await page.locator('input[name = "arrival_time[]"]').fill('10:00');

      //--------For checkbox selection-----------
      const checkbox = page.locator('input[type="checkbox"]').first();
      await checkbox.check();
      await expect(checkbox).toBeChecked();


      //--------------Adding 2nd row-----------------
      const multi = await page.locator('#new_row');
      await multi.click();

      //Destination Airport------------
      await page.click('#select2-destination-airport-1-container');
      // await airport1.click();
      //await page.fill('input.select2-search__field', 'OERK');
      await page.waitForSelector('.select2-results__option');
      await page.click('.select2-results__option:has-text("OERK")');

      //ui-datepicker-div

      const depart = await page.locator('input[name="departure_date[]"]').last();
      await depart.click();

      const depart1 = await page.locator('#ui-datepicker-div');
      await depart1.getByRole('link', { name: '12' }).click();

      const depart_time = await page.locator('input[id="departure_time[]"]').last();
      await depart_time.click();
      await depart_time.fill('10:00');


      const arrive = await page.locator('input[name="arrival_date[]"]').last();
      await arrive.click();
      const arrive1 = await page.locator('#ui-datepicker-div');
      await arrive1.getByRole('link', { name: '12' }).click();


      const arrive_time = await page.locator('input[name = "arrival_time[]"]').last();
      await arrive_time.click();
      await arrive_time.fill('10:00');

      const table = await page.locator('table#add-new-requests');
      const checkbox1 = table.locator('input[type="checkbox"]').last();
      await checkbox1.check();
      await expect(checkbox1).toBeChecked();


      //--------------Adding 3rd row-----------------
      const row = await page.locator('#new_row');
      await row.click();

      //Destination Airport------------
      await page.click('#select2-destination-airport-2-container');
      await page.fill('input.select2-search__field', 'HLLB');
      await page.waitForSelector('.select2-results__option');
      await page.click('.select2-results__option:has-text("HLLB")');


      //ui-datepicker-div


      const depart3 = await page.locator('input[name="departure_date[]"]').last();
      await depart3.click();

      const depart4 = await page.locator('#ui-datepicker-div');
      await depart4.getByRole('link', { name: '28' }).click();

      const depart_time1 = await page.locator('input[id="departure_time[]"]').last();
      await depart_time1.click();
      await depart_time1.fill('10:00');


      const arrive3 = await page.locator('input[name="arrival_date[]"]').last();
      await arrive3.click();
      const arrive2 = await page.locator('#ui-datepicker-div');
      await arrive2.getByRole('link', { name: '29' }).click();


      const arrive_time1 = await page.locator('input[name = "arrival_time[]"]').last();
      await arrive_time1.click();
      await arrive_time1.fill('10:00');

      const checkbox2 = table.locator('input[type="checkbox"]').last();
      await checkbox2.check();
      await expect(checkbox2).toBeChecked();

      await page.getByRole('button', { name: 'Save Request' }).click();
      await page.getByText('Request created successfully').isVisible();
      console.log('✅ New Request Saved/Created successfully');


      await expect(page).toHaveURL(/https:\/\/staging\.dev-tpac\.xyz\/request-detail\/\d+/); // dynamic id

      // Extract the new request ID from the URL
      const url = page.url();
      const match = url.match(/request-detail\/(\d+)/);
      const requestId = match ? match[1] : null;


      console.log('New Request Trip ID:', requestId);
      expect(requestId).not.toBeNull();


      //------------ ADD HANDLERS--------------
      const handlerstab = await page.locator('.table.table-striped.operators-table').nth(1);
      await page.getByRole('link', { name: 'Add Handlers' }).first().click();
      await page.locator('#flexCheckDefault_0').check();
      await page.getByRole('button', { name: 'Add Handlers' }).click();


      await page.getByRole('link', { name: 'Add Handlers' }).nth(1).click();
      await page.locator('#flexCheckDefault_0').check();
      await page.locator('#flexCheckDefault_1').check();
      await page.getByRole('button', { name: 'Add Handlers' }).click();

      // START PROCESS----------
      const startprocess = await page.locator('.start_proccess-btnWrapper');
      await startprocess.waitFor({ state: 'visible' });
      await startprocess.getByRole('link', { name: ' Start Process ' }).first().click();

      //await page.getByRole('link', { name: 'Start Process' }).click();  

      const startModal = await page.locator('#startProcessModal');
      await startModal.waitFor({ state: 'visible' });
      await startModal.getByRole('button', { name: 'Start Process' }).click();

      //----------------------------Aircraft/Operator Addition-----------------------------------
      const operator = await page.locator('#leg_tables').first();
      await operator.locator('a[onclick^="createNewRow"]').first().click();

      /*
      //------------------------------------------------BRK HERE----------------------------------
      const newtable= await page.locator('#new-operator-table');
      await newtable.getByPlaceholder('Search operator').click();
      await newtable.locator('input[name = "operator[]"]').fill('Qwerty');
      
      await page.getByPlaceholder('Search Aircraft').click();
      await page.locator('input[name = "aircraft[]"]').fill('ew');
      //pax is auto generated----
      
      await page.getByPlaceholder('Reg No.').click();
      await page.locator('input[name = "reg_no[]"]').fill('IC');
      
      await page.getByPlaceholder('Max Seats').click();
      await page.locator('input[name = "max_seats[]"]').fill('7');
      
      await page.getByRole('combobox', { name: 'Select Category' }).click();
      await page.getByRole('combobox', { name: 'Select Category' }).getByTitle('Midsize');
      await page.getByRole('option', { name: ' Midsize' }).click();
      
      await page.getByRole('combobox', { name:'USD' }).first().click();
      await page.locator('.select2-results__option', { hasText: 'SAR' }).click(); // change in existing 
      
      //await page.scrollIntoViewIfNeeded();
      
      
      //--------------------------Currency check as per updated prices------------------------------------------------
      
       //currency dropdown menu
      
      await page.locator('input[name = "price[]"]').click();
      await page.locator('input[id = "price[]"]').fill('700');
      
      await page.waitForLoadState('networkidle');
      await page.locator('input[name="total[]"]').click();
      
      */

      // Find the latest row dynamically (it’ll have id like dynamicTrXXXX)
      const latestRow = operator.locator('tr').last();
      await latestRow.waitFor({ state: 'visible' });

      // --- Log row ID for reference ---
      const rowId = await latestRow.getAttribute('id');
      console.log('🆕 Latest new created Row ID:', rowId);
      await page.waitForTimeout(2000);

      // === Fill all fields under this row ===
      /*
          // 1️⃣ Operator
          const operatorInput = latestRow.locator('td.search-operator').first();
          await operatorInput.fill('Charter');
          await page.waitForTimeout(500); // wait for suggestions
      
          // Select operator from autocomplete dropdown
          const operatorSuggestion = operatorInput.locator('.ui-autocomplete li', { hasText: 'Air Charter Scotland' });
          if (await operatorSuggestion.isVisible()) {
            await operatorSuggestion.click();
          }
      
          // 2️⃣ Aircraft
          const aircraftDropdown = latestRow.locator('span.select2-selection');
          await aircraftDropdown.click();
          //await aircraftDropdown.selectOption({ label: 'Select aircraft type' }); // or real label
          const searchBox = page.locator('input.select2-search__field');
          await searchBox.waitFor({ state: 'visible' });
      
          // Type part of aircraft name
          await searchBox.fill('Falcon');
      
          // Wait for results and select the correct one
          const option = page.locator('.select2-results__option', { hasText: 'Falcon 7X' });
          await option.waitFor({ state: 'visible' });
          await option.click();
      
      
          // 3️⃣ Pax
          const paxInput = latestRow.locator('input[name="pax[]"]');
          await paxInput.fill('5');
      
          // 4️⃣ Stops
          const stopsInput = latestRow.locator('input[name="stops[]"]');
          await stopsInput.fill('1');
      
          // 5️⃣ Category
          const categoryDropdown = latestRow.locator('select[name="category[]"]');
          await categoryDropdown.selectOption({ label: 'Midsize' });
      
          // 6️⃣ Homebase
          const homebaseInput = latestRow.locator('input[name="homebase[]"]');
          await homebaseInput.fill('DXB');
      
          // 7️⃣ Currency
          const currencyDropdown = latestRow.locator('select.currency_select');
          await currencyDropdown.selectOption({ label: 'USD' });
      
          // 8️⃣ Price
          const priceInput = latestRow.locator('input[name="price[]"]');
          await priceInput.fill('7000');
      
          // ✅ Optional: verify row filled
          await expect(operatorInput).toHaveValue(/Charter/i);
      
          console.log('✅ Latest operator row filled successfully!');
      
          //('a[onclick^="sendFlightBriefingMailWithPdfLink"]')
          */

    });


  });
});

/*
  test('Verify Table Structure', async ({ page }) => {
    const headers = await page.$$eval('#new-operator-table th', ths => ths.map(th => th.textContent?.trim()));
    console.log('Table Headers:', headers);
    expect(headers).toContain('Operator');
    expect(headers).toContain('Aircraft');
    expect(headers).toContain('Currency');
  });
  */
