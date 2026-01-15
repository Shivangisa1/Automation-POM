import { test, expect } from '@playwright/test';
import { link } from 'fs';
import * as fs from 'fs';
import * as path from 'path';


test.describe('Validating the View Request Flow', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('admin@mailinator.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Tpac@123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('https://staging.dev-tpac.xyz/dashboard');
  
    await page.getByRole('link', { name: 'Requests' }).click();
    //await page.getByRole('link', {name: 'All Requests'}).click();
  });



   test('Test case 1: Validate the number of trip requests ', async ({ page }) => {

    const infoText = await page.locator('#requests_table_info');
    await infoText.waitFor({ state: 'visible' });

   const entry= await infoText.textContent();     
   console.log("Total number of requests are showing as :", entry);

 const match = entry?.match(/of\s+(\d+)\s+entries/i);
  const totalEntries = match ? match[1] : null;

  console.log(`📊 Total entries: ${totalEntries}`);

});

  test('Test case 2: Validating the generation of Confirm Booking Request(CBR) without quotation: ', async ({ page }) => {

 await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

 await page.waitForTimeout(1000);
 const Aircrfattable = await page.locator('table.table.table-striped.operators-table.singleLegTable'); //Select the table under Aircraft/Operators table.
 await Aircrfattable.locator('input.select-all-checkbox.form-check-input').check();  // Locator has been changed...........
 await page.waitForTimeout(1000);
 await page.locator('a[onclick^="directCbrCustomizer"]').click();


  const CBR= await page.locator('#customize-generate-cbr-offcanvas');
  await expect(CBR).toBeVisible({ timeout: 10000 });
  console.log('✅ CBR Modal is visible.');
  await CBR.locator('#select2-CbrCurrency-container').click();
  const currUSD= await page.locator('.select2-results__option',{hasText: 'USD'}).click();

  await CBR.locator('#select2-cbr_font_family-container').click();
  const font= await page.locator('.select2-results__option',{hasText: 'Effra Std Rg'}).click();

// switch UTC creates issue-------
  await page.locator('label[for^="cbr_time_zone-2"]').click(); // click via label
  await expect(page.locator('input[name="cbrTimeZone"][value="Yes"]')).toBeChecked(); 

  await CBR.locator('#select2-cbrLanguage-container').click();
  const lang= await page.locator('.select2-results__option',{hasText: 'English'}).click();

  await CBR.locator('a[onclick^="generateCbr"]').click();
  //await expect(CBR.locator('.toast toast-error', { hasText: 'Bank is mandatory' })).toBeVisible(); // div.toast-container

//--------------------Validate the error message if bank is not selected-------------------------
//-----------------------------------------------
// Wait for the toast message to appear
const toastMessage = page.locator('div.toast-message');
const toastText = await page.locator('div.toast-message').innerText();
console.log('❌ Error message:', toastText);

// Assert that the toast is visible and contains the expected text
await expect(toastMessage).toBeVisible();
await expect(toastMessage).toHaveText(/Bank is mandatory!/);  // select2-bank_account-container

await page.waitForTimeout(3000); // wait for 2 seconds to see the toast message

await CBR.locator('#select2-bank_account-container').click();
await page.locator('.select2-results__option',{hasText: 'Saudi National Bank (EUR)'}).click();
await CBR.locator('a[onclick^="generateCbr"]').click();


// send CBR to email, download in PDF, download word----------------
//match currency to CBR page currency
const cbrpage= await page.locator('#renderCbrViewHtml tr table td', { hasText: 'Total Price' });
await cbrpage.waitFor({ state: 'visible', timeout: 3000 });  // wait for it to appear

const CbrCurrency = await cbrpage.innerText();
console.log('Cbr page currency is:', CbrCurrency);

//await sendemail.locator('a[onclick^="sendCbrMailWithPdfLink"]').click();  // send email cBR not working as not developed and not other buttons too

//await sendemail.locator('a[onclick^="generateCbrPDF"]').click();       // download the CBR in PDF
//await sendemail.locator('a[onclick^="saveDraftCbr()"]').click();    // save the CBR in draft

//--------------All buttons in footers of CBR page------------------------------
const sendemail = page.locator('#renderCbrViewHtml .modal-footer a');
const count = await sendemail.count();
console.log(`Found ${count} buttons in modal-footer`); 
const buttonsemail= await sendemail.allInnerTexts();   // all buttons download pdf, send email, save draft, share link, download word.
console.log('Buttons in footer are:', buttonsemail);

//--------------------Click on each button and perform respective action-----------------------
// Folder where files will be saved

//const downloadDir = 'C:/Users/dell/Documents/Automation downloads';


/*
const toastMessage1 = page.locator('div.toast-message');
const toastText1 = await page.locator('div.toast-message').innerText();
console.log('❌ Error message:', toastText1);
*/

// --------------------Handle Share Link-----------------------
const shareButton = sendemail.locator('a[onclick^="generateCbrShareableLink"]');
console.log('Button foind for share link is :', await shareButton.count());
if (await shareButton.isVisible()) {
  await shareButton.click();
  const copiedLink = await page.evaluate(() => navigator.clipboard.readText());
  console.log('🔗 Copied Share Link:', copiedLink);
}

  });


test('Test case 3: Validating the generation of quotation: ', async ({ page }) => {

 await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

 const Aircrfattable = await page.locator('table.table.table-striped.operators-table.singleLegTable'); //Select the table under Aircraft/Operators table.
 await Aircrfattable.locator('input.select-all-checkbox.form-check-input').check();  // Locator has been changed...........
 await page.waitForTimeout(1000);
 await page.getByRole('link', { name: 'Generate Quotation' }).click();

  const modal = page.locator('#customize-generate-offcanvas');
  await expect(modal).toBeVisible({ timeout: 10000 });
  console.log('✅ Modal is visible.');

  // Extract and log all visible text content from modal
  //const modalText = await modal.innerText();  
  //console.log('🧩 Modal contains:\n', modalText);

  const currencyDropdown = modal.locator('select').first();  // SET CURRENCY
  await currencyDropdown.selectOption({ label: 'SAR' });
  const selectedCurrency = await currencyDropdown.inputValue();
  console.log('💰 Selected Currency:', selectedCurrency);

  const fontDropdown = modal.locator('select').nth(1);      // SET FONT FAMILY
  await fontDropdown.selectOption({ label: 'DejaVuSans' });
  const selectedFont = await fontDropdown.inputValue();
  console.log('🖋️ Selected Font Family:', selectedFont);
/*
// Locate the radio buttons for Generate Quote in UTC Time Zone
const utcYesLabel = page.locator('label[for^="quote_time_zone_"][text()="Yes"]');
await utcYesLabel.first().click();
*/

//SElect language----------
const langauge = modal.locator('select').nth(3); 
  await langauge.selectOption({ label: 'English' });
  const selectedlang = await langauge.inputValue();
  console.log('🖋️ Selected language is :', selectedlang);

//Select Address---------
  const address = modal.locator('select').nth(4);
  await address.selectOption({ label: 'USA' });
  const selectedadd = await address.inputValue();
  console.log('🖋️ Selected address is :', selectedadd);

//select Classification----------
  const Classification = modal.locator('select').nth(5);
  await Classification.selectOption({ label: 'Standard' });
  const selectedclass = await Classification.inputValue();
  console.log('🖋️ Selected Classfication is :', selectedclass);

  // Wait for CKEditor iframe to appear
const editorFrame = page.frameLocator('iframe.cke_wysiwyg_frame');

// Focus the editor body and type text
await editorFrame.locator('body.cke_editable').click();
await editorFrame.locator('body.cke_editable').type('\nPlease select required information to display on quotation.... by automation engineer');

  //--------To generate the quotation------------------------
  await modal.getByRole('link', {name : 'Generate Quote'}).click();
  console.log('Quotation will be saved in Draft successfully');

/*
//close the button------
 await modal.locator('button.btn-close').click();
  await expect(modal).toBeHidden();
  console.log('✅ Modal closed successfully.');

  await page.waitForTimeout(1000);
  const quote= await page.locator("#renderQuotationView");
  await quote.locator('a[onclick^="sendMailWithPdfLink"]').click();

  //----------------SEND MAIL FR QUOTATION------------------ Issue: Generate quotation takes too much tme in buffering--------
  await page.waitForTimeout(5000);
 const quoteform= page.locator('#sendQuotationEmailForm');
 //await expect(quoteform).toBeHidden({ timeout: 10000 });
 //console.log('✅ Quotation form is visible.');

    await quoteform.locator('input[id="#recipientEmail"]').fill('shivangi.saraswat@desklay.com');
    await quoteform.locator('button:has-text("Send")').click();
    await page.waitForTimeout(2000);
    await expect(quoteform).toBeHidden();
    console.log('✅ Quotation send successfully.');
    */
   /*
//close the modal window -which save it in draft....
const quote= await page.locator("#renderQuotationView");
await page.waitForTimeout(5000);
await quote.locator('button.btn-close').first().click();

//VALIDATE THE QUOTATION PRICE IN GENARTE QUOTATION WITH TOTAL PRICE IN USD---------------
//MAKE ANOTHER SCript for it to validate the price in USD because it takes only in USD value
//Subservices cost will be added in total price after clicking on sync button in quotation page
//Generate CBR from quotaion  
//Generate CBR without quotation -- generate CBR- send email, other functions....*/

});



      test('Test case 4: Validate the view icon on Aircraft/OPerators TAble: ', async ({ page }) => {
        await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

const table = page.locator('table.table.table-striped.operators-table.singleLegTable');
//const quotedPrices = page.locator('table.table.table-striped.operators-table.singleLegTable span[id^="tab_op_usd"]'); --- just print usd value

/* print all contents of the table in aircraft/operator -------------------
// Wait for it to appear
await table.waitFor({ state: 'visible' });

// Locate all rows inside tbody
const rows = table.locator('tbody tr');
const rowCount = await rows.count();

console.log(`Total rows found: ${rowCount}\n`);

// Loop through rows
for (let i = 0; i < rowCount; i++) {
  const row = rows.nth(i);
  const cells = row.locator('td');
  const cellCount = await cells.count();
  let rowData: string[] = [];

  for (let j = 0; j < cellCount; j++) {
    const cellText = (await cells.nth(j).textContent())?.trim() || '';
    rowData.push(cellText);
  }

  console.log(`Row ${i + 1}:`, rowData.join(' | '));
}
  */
//------------------ Print the USD value from the table-------------------

const usdValue1 = await table.locator('span[id^="tab_op_usd"]'); 
await usdValue1.waitFor({ state: 'visible' });
const usdvalue2= await usdValue1.textContent();

//const usd = parseFloat(usdValue); // show with floating value
console.log("value in usd is :" , usdvalue2); 

        await page.locator('a[onclick^="viewAircraftOperatorDetails"]').first().click(); // for view icons

const modalview = page.locator('#viewAircraftOperatorDetails-offcanvas'); // view icon in aircraft table
  await expect(modalview).toBeVisible({ timeout: 10000 });
  console.log('✅ Modal is visible.');

    //const text= modalview.waitForSelector('textarea[name="others"]', { state: 'visible' });
await modalview.locator('textarea[name="others"]').fill('Remarks By test...');

//------------Giving validation on mandatory fields--------------
/* having issue in website- not showing options

await modalview.locator('#select2-country-container').click(); // open dropdown for country
await modalview.locator('.select2-results__option', { hasText: 'India' }).click(); // we can use index for robust

await page.waitForTimeout(1000);
      
await modalview.locator('#select2-state-container').click(); // open dropdown fr state
await modalview.locator('.select2-results__option', { hasText: 'Madhya Pradesh' }).click();

await page.waitForTimeout(1000);

await modalview.locator('#select2-city-container').click(); // open dropdown fr city
await modalview.locator('.select2-results__option', { hasText: 'Indore' }).click();
await modalview.getByRole('link', {name: 'Save'}).first().click();
*/

   //Chnage the currency to EUR------
await modalview.locator('#select2-tpacCurrency-container').click();
const currEUR= await page.locator('.select2-results__option',{hasText: 'EUR'}).click();
console.log("currency changes to:" , currEUR);

await page.waitForTimeout(1000);

  const operatorcost = await modalview.locator('input#tpacPrice').inputValue();
  const operatorcostValue = parseFloat(operatorcost);
  //convert usdvalue2 to number safely-------------
  const usdValueNumber = parseFloat(usdvalue2 || '0');

  const expectedEUR = (usdValueNumber * 0.25).toFixed();  // conversion rate for EUR
  const expectedSAR = (usdValueNumber * 0.5).toFixed();   // conversion rate for SAR
 console.log("Operator cost in EUR is:", operatorcostValue);
 console.log("Expected operator cost in EUR is:", expectedEUR);

 //-----------Validate the conversion rate for EUR--------------------
 if (operatorcostValue.toFixed() === expectedEUR) {
  console.log('✅ Operator cost in EUR is correct.');
} else {
  console.error(`❌ Operator cost in EUR is incorrect. Expected: ${expectedEUR}, Found: ${operatorcostValue}`);
}
/*
//-------Change the currency to SAR------- need to remove this , works for 1 change currency only
await modalview.locator('#select2-tpacCurrency-container').click();
const currSAR= await page.locator('.select2-results__option',{hasText: 'SAR'}).click();
console.log("currency changes to:" , currSAR);

await page.waitForTimeout(1000);

 console.log("Operator cost in SAR is:", operatorcostValue);
 console.log("Expected operator cost in SAR is:", expectedSAR);

 //-----------Validate the conversion rate for SAR--------------------
 if (operatorcostValue.toFixed() === expectedSAR) { //const num = 12.3456; num.toFixed(2); // "12.35"
  console.log('✅ Operator cost in EUR is correct.');
} else {
  console.error(`❌ Operator cost in EUR is incorrect. Expected: ${expectedSAR}, Found: ${operatorcostValue}`);
}  */

//---------Validate the Margin, Discount and Total price-------------------------
const margin = await modalview.locator('input#tpacMargin').fill('1.0');
const marginvalue= await modalview.locator('input#tpacMargin').inputValue();
console.log("Margin is:", marginvalue);

const discount = await modalview.locator('input#tpacDiscountValue').fill('3');
const discountvalue= await modalview.locator('input#tpacDiscountValue').inputValue();
console.log("Discount is:", discountvalue);
await page.waitForTimeout(1000);
 
 //tpacFinalCost
 const totalprice= await modalview.locator('input#tpacFinalCost').inputValue();
 console.log("Total price is:", totalprice);        

 //----------------Validate the total price-----------
const cost = Number(operatorcostValue);  //125
const margin1 = Number(marginvalue);    //1
const discount1 = Number(discountvalue); // 3
const total = Number(totalprice); //123

if (((cost + margin1) - discount1) == total) {
  console.log("✅ Correct total");
} else {
  console.error("❌ Incorrect total");
}

await modalview.locator('a.tpacSubmitForm').first().click();    // Save Button in details modal window-------
console.log("Saved the details successfully");


      });


test('Test case 5 : Validate the Trip Request Details', async ({ page }) => {

 // ---------- Validate Buttons ----------

await page.goto('https://staging.dev-tpac.xyz/request-detail/447');
const view= await page.locator('a[onclick^="viewCombinationData"]').click();
await page.locator('a[onclick^="getTrip"]').click();
await page.getByRole('link', {name:'Rerun Search'}).click();

// Click on "Rerun Search" and wait for new tab to open
  const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),   // <-- context comes from page
  page.getByRole('link', { name: 'Rerun Search' }).click()
]);

await newPage.close();
await page.bringToFront();

//click on view in avinode
const [newPage1] = await Promise.all([
  page.context().waitForEvent('page'),   // <-- context comes from page
  page.getByRole('link', { name: 'View in Avinode' }).click()
]);

await newPage1.close();
await page.bringToFront();
await page.waitForTimeout(5000);
});


test('Test case 6 : Validate the page level buttons', async ({ page }) => {

await page.goto('https://staging.dev-tpac.xyz/request-detail/447');
await page.locator('a[onclick^="generateLegsPDF"]').first().click();

const [download] = await Promise.all([
  page.waitForEvent('download'),                                      // capture download
 page.locator('a[onclick^="generateLegsExcel"]').click()              // the action that triggers download
]);
const filePath = 'C:/Users/dell/Documents/Automation downloads/myFile.pdf';
await download.saveAs(filePath);                                     // save in my machine
console.log(`Downloaded file saved to: ${filePath}`);   


await page.locator('a[onclick^="generateLegsPDF"]').nth(1).click();
await page.locator('a[onclick^="applyUpdatedRate"]').click();
//await page.locator('a[onclick^="generateRequestLogs"]').click(); // Activity Logs

//  Capture values from Request page
const items = await page.locator('ul.ticket-detail li'); // Get all li elements under ul.ticket-detail

// Loop through each li
const count = await items.count();
for (let i = 0; i < count; i++) {
  const label = await items.nth(i).locator('p').textContent();
  const value = await items.nth(i).locator('h5').textContent();

  console.log(`${label?.trim()}: ${value?.trim()}`);  // print all the info in console
}
await page.waitForTimeout(1000);
});

test('Test case 7 : Validate the Customer information for the trip request', async ({ page }) => {
 
    await page.goto('https://staging.dev-tpac.xyz/request-detail/447');
 // Click on "View Customer Info" (to open the side panel)
await page.getByRole('link', {name: 'View Customer Info'}).click(); 
await page.waitForLoadState('load');

  // Capture values from Customer Details panel(view customer info)-------
  // Extract all h5 + p pairs from Customer Details page
const details = await page.locator('.customer_info_canvas .col-md-6');

const count1 = await details.count();

for (let i = 0; i < count1; i++) {

    try {

  const label1 = await details.nth(i).locator('h5').textContent().catch(() => null);
  const value1 = await details.nth(i).locator('p').textContent().catch(() => null);

  if (label1 && value1) {
    console.log(`${label1.trim()} : ${value1.trim()}`);
  }
  else if (label1 && !value1) {
  console.log(`${label1.trim()} : Value not found`);
  }
   else if (!label1 && value1) {
  console.log(`Label missing : ${value1.trim()}`);
} 
else {
  console.log('Both label and value are missing');
}


}
catch(error) {    console.warn(`Skipping entry ${i + 1} due to missing element or error:`, error);
} }

const offcanvas = page.locator('#customerInfo-offcanvas');
await expect(offcanvas).toBeVisible({ timeout: 10000 });
await offcanvas.locator('button.btn-close[data-bs-dismiss="offcanvas"]').click();
await expect(offcanvas).toBeHidden({ timeout: 10000 });

//await page.getByRole('button',{name: 'close'}).click();
//await page.waitForLoadState('networkidle');
});


test('Test case 8 : Verify the Aircraft/Operator table is created', async ({ page }) => {

    await page.goto('https://staging.dev-tpac.xyz/request-detail/447');
//---------------------Create new row under Aircraft/Operator table------------
await page.locator('a[onclick^="createNewRow"]').click();

  await page.waitForSelector('#new-operator-table tbody tr');
    const rows = await page.$$('#new-operator-table tbody tr');

      console.log(`✅ Found ${rows.length} rows in the Operator table`);

await page.getByPlaceholder('Search operator').click();
await page.locator('input[name = "operator[]"]').fill('Qwerty');

//await page.getByPlaceholder('Search Aircraft').click();
await page.locator('input[name = "aircraft_id[]"]').fill('ew');
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
//const ss1= await page.locator('input[name="total[]"]').textContent();
//console.log("Total is:", ss1);
/*
// ------------Save the request in the new table first----------------
const table = page.locator('#new-operator-table'); // or nth(0), nth(2) 
const saveButton = table.locator('a[onclick^="saveOperatorsRow"]');
await saveButton.click();

/*
// Wait for the save icon to appear -----for the existing table------
await page.locator('a[onclick^="saveRequestAircraftModal"]').first().click();
await Promise.all([
  page.waitForSelector('.modal-body .ma_warningModal_wrapper', { state: 'detached' }),
  page.locator('button.enableAutoMarginBtn').click()
]);
*/
await page.waitForLoadState('networkidle');

console.log("✅ Clicked on the Save icon successfully!");
});


 /*test('Test case 9 : Validate the data Quotation contents with the details in Aircraft table', async ({ page }) => {

await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

const Aircrfattable = await page.locator('table.table.table-striped.operators-table.singleLegTable'); //Select the table under Aircraft/Operators table.
 await Aircrfattable.locator('input.select-all-checkbox.form-check-input').check();  // Locator has been changed...........
 await page.waitForTimeout(1000);
 await page.locator('a[onclick^="quotationCustomizationCanvas"]').click(); // for generating quotation


await page.getByRole('combobox', { name:'USD' }).first().click();
const currentcurrency= await page.locator('.select2-results__option', { hasText: 'SAR' }).click(); // change in existing 
//console.log("Now currency changed to:", currentcurrency);

const currencyDropdown = page.locator('select[name ="currency[]"]').first(); //#operators-table .select2-tab_currency
const selectedCurrency = await currencyDropdown.inputValue();
console.log("Currency is in:", selectedCurrency);



const usdValue = await page.locator('input[id^="tab_op_price_init"]').inputValue(); 
const usd = parseFloat(usdValue); // show with floating value
console.log("value in usd is :" , usd);

const quotedPriceText = await page.locator('td.price span').first().textContent(); 
console.log("quoted price is:", quotedPriceText);

const discount = await page.locator('td.discount span').first().textContent(); 
console.log("Current discount is:", discount);

 await page.locator('input[name = "margin_percent"]').click();

});
*/

test('Test case 9 : Validate the data Quotation contents with the details in Aircraft table', async ({ page }) => {

await page.goto('https://staging.dev-tpac.xyz/request-detail/447');

 const Aircrfattable = await page.locator('table.table.table-striped.operators-table.singleLegTable'); //Select the table under Aircraft/Operators table.
 await Aircrfattable.locator('input.select-all-checkbox.form-check-input').check();  // Locator has been changed...........
 await page.waitForTimeout(1000);
 await page.locator('a[onclick^="quotationCustomizationCanvas"]').click(); // for generating quotation


 await page.getByRole('combobox', { name:'USD' }).first().click();
 const currentcurrency= await page.locator('.select2-results__option', { hasText: 'SAR' }).click(); // change in existing 
//console.log("Now currency changed to:", currentcurrency);
/*
const currencyDropdown = page.locator('select[name ="currency[]"]').first(); //#operators-table .select2-tab_currency
const selectedCurrency = await currencyDropdown.inputValue();
console.log("Currency is in:", selectedCurrency);
*/

const usdValue = await page.locator('input[id^="tab_op_price_init"]').inputValue(); 
const usd = parseFloat(usdValue); // show with floating value
console.log("value in usd is :" , usd);

const quotedPriceText = await page.locator('td.price span').first().textContent(); 
console.log("quoted price is:", quotedPriceText);

const discount = await page.locator('td.discount span').first().textContent(); 
console.log("Current discount is:", discount);

});

  });


//icon-link save-operators-row

  // Now get all rows
  //const rows = await page.locator('#operators-table238 tbody tr'); // dynamic table id 
  //const rowCount = await rows.count();
  //console.log(`✅ Total rows found: ${rows.count}`);



/*
for (let i = 0; i < rows; i++) {
    const row = rows[i];
    // Extract text from each relevant column
    const operator = (await row.$$('#operators-table238 tbody tr td:nth-child(2)').innerText()).trim(); // Operator column
    const aircraft = (await row.$$('#operators-table238 tbody tr td:nth-child(3)').innerText()).trim(); // Aircraft column
    const pax = (await row.$$('#operators-table238 tbody tr td:nth-child(6)').innerText());      // PAX column
    const route = (await row.$$('#operators-table238 tbody tr td:nth-child(10)').innerText());   // Route (if needed)
    const currency = await row.locator('#operators-table238 tbody tr td:nth-child(11)').innerText();// Currency


*/






  // Assertions
  //await expect(sellerNameDetails).toBe(sellerNameRequest);
  //await expect(officerDetails).toBe(officerRequest);
  //await expect(flightTypeDetails).toBe(flightTypeRequest);   


















/*
  const buttons = [
    { link: 'View',  }, 
    { link: 'Rerun Search', locator: 'link:has-text("Rerun Search")' },
    { link: 'View in Avinode', locator: 'link:has-text("View in Avinode")' },
    { link: 'PDF', locator: 'link:has-text("PDF")' },
    { link: 'Customize View', locator: 'button:has-text("Customize View")' }
  ];

  for (const btn of buttons) {
    const button = page.locator(btn.locator);
    await expect(button, `${btn.name} button not visible`).toBeVisible();
  }

  // ---------- Validate Table Data ----------
  const row = page.locator('table >> tbody >> tr').first();

  const operator = await row.locator('td').nth(1).innerText();
  const aircraft = await row.locator('td').nth(2).innerText();
  const maxSeats = await row.locator('td').nth(3).innerText();
  const pax = await row.locator('td').nth(5).innerText();
  const regNo = await row.locator('td').nth(6).innerText();

  console.log('Row Data:', { operator, aircraft, maxSeats, pax, regNo });

  expect(operator).toBeTruthy();
  expect(aircraft).toBeTruthy();
  expect(Number(maxSeats)).toBeGreaterThan(0);
  expect(Number(pax)).toBeGreaterThan(0);

  // ---------- Validate Currency Calculation ----------
  const quotedPriceText = await row.locator('td').nth(11).innerText(); // Quoted Price
  const usdText = await row.locator('td').nth(12).innerText();         // USD
  const marginText = await row.locator('td').nth(13).innerText();      // Margin

  const quotedPrice = Number(quotedPriceText.replace(/,/g, ''));
  const usd = Number(usdText.replace(/,/g, ''));
  const margin = Number(marginText.replace(/,/g, ''));

  console.log({ quotedPrice, usd, margin });

  // Business rule: QuotedPrice == USD + Margin
  expect(quotedPrice).toBe(usd + margin);
*/