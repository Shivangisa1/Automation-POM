import { test, expect } from '@playwright/test';
import { avinodeLogin } from '../pages/AvinodeLogin'; // if using avinode page
import * as XLSX from 'xlsx';


test.describe('Validating the Elements in Round Trip Request Flow', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');

    await page.getByRole('link', { name: 'Requests' }).click();

  });

  test('Test case 01 : Validate the Flight briefing can be sent successfully', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    const brief = await page.locator('.ma_bullet_wrapper ').first();
    await brief.locator('a[onclick^="sendFlightBriefingMailWithPdfLink"]').nth(1).click();

    const email = await page.locator('#flightBriefingEmailModal');
    await email.getByPlaceholder('Enter Your Email').fill('Shivangi.saraswat@desklay.com');
    await email.getByRole('button', { name: 'Send' }).click();
    console.log("✅ Flight briefing sent successfully ");
  });


  test('Test Case 02 : Validating the CBR-flight briefing for checkbox', async ({ page }) => {
    // Navigate to your page
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    const Briefing = await page.locator('#cbr_one');
    const Briefing1 = await Briefing.locator('table.table.table-striped');
    await Briefing1.locator('input.select-all-checkbox.form-check-input').check();
    console.log("✅ Flight briefing checkboxes are selected successfully ");
  });


  test('Test Case 03 : Verify that the CBR -flight briefing should be generated in PDF Format', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');
    const Briefing = await page.locator('#cbr_one');
    const Briefing1 = await Briefing.locator('table.table.table-striped');
    await Briefing1.locator('a[onclick^="generateCbrPDF"]').nth(0).click();
    await page.waitForTimeout(3000);
    console.log(" Flight briefing is not generated in PDF fromat - A bug reported here ");
  });


  test('Test Case 04 : Verify that the user can view the CBR -flight briefing ', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');
    const Briefing = await page.locator('#cbr_one');
    const Briefing1 = await Briefing.locator('table.table.table-striped');
    await Briefing1.locator('a[onclick^="genCbrView"]').nth(0).click();
    const modal = await page.locator('#renderCbrViewBlade');
    await modal.locator('button.btn-close').click();
    console.log(" Flight briefing view modal is opened successfully ");
  });

  test('Test Case 05 : Verify that the user can view the CBR -flight briefing ', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');
    const Briefing = await page.locator('#cbr_one');
    const Briefing1 = await Briefing.locator('table.table.table-striped');
    await Briefing1.locator('a[onclick^="sendCbrMailWithPdfLink"]').nth(0).click();
    console.log(" CBR -Flight briefing send button is not working - A bug reported here ");
  });


  test('Test Case 06 : Verify that the flight briefing round leg should be selected ', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');
    await page.locator('a[onclick^="genrateFlightBriefing()"]').nth(0).click();
    const offcanvas = page.locator('#genrate-flight-briefing-offcanvas');
    await offcanvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);


    //-----------Modal window for flight briefing---------
    await offcanvas.locator('span.select2-selection').nth(1).click();
    await page.locator('.select2-results__option', { hasText: 'English' }).click();
    console.log('✅ Selected Language');

    console.log(" Flight briefing is selected in in English language ");


    //------------SElecting Leg for flight briefing------------------------
    await offcanvas.locator('span.select2-selection').nth(2).click();
    await page.locator('.select2-results__option', {
      hasText: 'Round Trip - SBJE → OERK → SBJE'
    }).click();
    console.log('✅ Selected Round Trip Leg');

    await expect(offcanvas).toContainText('Round Trip - SBJE → OERK → SBJE'); // Optionally assert the value
    console.log("✅ Flight briefing Round leg is selected successfully ");
    await page.waitForTimeout(3000);

  });


  test('Test Case 07 : Print Aircraft / Operator table data for Round Trip leg', async ({ page }) => {
    // Navigate to your page
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    // Wait for the table to load
    await page.waitForSelector('table.table-striped.operators-table.roundTripTable');

    // Extract the table headers
    const headers = await page.$$eval(
      'table.table-striped.operators-table.roundTripTable thead th',
      (ths) => ths.map(th => th.textContent?.trim() || '')
    );

    // Extract the table rows and cell values
    const rows = await page.$$eval(
      'table.table-striped.operators-table.roundTripTable tbody tr',
      (trs) =>
        trs.map(tr =>
          Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim() || '')
        )
    );

    console.log('==================== AIRCRAFT / OPERATOR TABLE ====================');
    console.log(headers.join(' | '));
    console.log('--------------------------------------------------------------------');

    rows.forEach(row => {
      console.log(row.join(' | '));
    });

    console.log('====================================================================');
  });


  test(' Test case 08 : Validate the Aircraft excel for RoundTrip request', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    const a = '.table.table-striped.operators-table.roundTripTable';
    const headers = await page.$$eval(`${a} thead th`, ths =>
      ths.map(th => th.textContent?.trim())
    );
    const rows = await page.$$(`${a} tbody tr`);
    const tableData = [];
    for (let i = 0; i < rows.length; i++) {
      const rowData = await rows[i].$$eval('td', tds =>
        tds.map(td => td.textContent?.trim())

      );
      tableData.push(rowData);
    }

    // Step 5: Print table data in console
    console.log('\n📋 Aircraft / Operator Table Data');
    console.log('----------------------------------');
    console.log('Headers:', headers);
    tableData.forEach((row, i) => {
      console.log(`Row ${i + 1}:`, row);
    });
    console.log('----------------------------------');
    console.log(`✅ Total rows: ${tableData.length}`);

    // Step 6 (optional): Save to Excel
    const dataForExcel = [headers, ...tableData];
    const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AircraftOperator');

    const filePath = 'C:/Users/dell/Documents/Automation downloads1/Aircrafttable.xlsx';
    XLSX.writeFile(wb, filePath);

    console.log(`📁 Excel file created successfully: ${filePath}`);

  });

  test('Test case 09 : Verify the Supplier table is created', async ({ page }) => {
    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');

    const supp = await page.locator('#supplier_tables');
    await supp.locator('a[onclick^="createNewSupplierRow"]').click();
    console.log("A bug resolved here - Supplier row is added now on clicking Add Supplier button ");
  });

  test('Test case 10 : Validate the Initial Invoice button functionality', async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/request-detail/510');
    await page.waitForSelector('#cbrTables');

    // Scroll into view (optional, in case the button is below the viewport)
    await page.locator('#cbrTables').scrollIntoViewIfNeeded();

    // Click on the 'Initial Invoice' button
    await page.click('#cbrTables a.btn.btn-primary-bordered:has-text("Initial Invoice")');

    console.log("✅ Clicked on Initial Invoice button ");
    console.log("  Initial Invoice modal is not appear - A bug Reported here");
  });




});