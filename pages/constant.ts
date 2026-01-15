export const selectors = {
  tpacMarginInput: 'input#tpacMargin',
  createCbrButton: 'button:has-text("Create CBR")',
  toastMessage: 'div.toast-message',
};

export const messages = {
  bankMandatory: 'Bank is mandatory!',
};
  // -----------------------------------CBR Pages-----------------------------------------
   /*
  import { Page } from '@playwright/test';

export class CBRPage {
  constructor(private page: Page) {}

  tpacMarginInput = this.page.locator('input#tpacMargin');
  createCbrButton = this.page.locator('button:has-text("Create CBR")');
  toastMessage = this.page.locator('div.toast-message');

  async clickCreateCbr() {
    await this.createCbrButton.click();
  }

  async getToastText() {
    return await this.toastMessage.innerText();
  }
}
*/