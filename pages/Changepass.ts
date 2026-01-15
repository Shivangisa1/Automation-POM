import { Page, Locator } from '@playwright/test';
export class Changepass {

  readonly page: Page;
  readonly currentpass: Locator;
  readonly newpass: Locator;
  readonly confirmpass: Locator;
  readonly updatebutton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currentpass = page.getByPlaceholder('Enter current password');
    this.newpass = page.getByPlaceholder('Enter new password');
    this.confirmpass = page.getByPlaceholder('Confirm new password');
    this.updatebutton = page.getByRole('button', { name: 'Update Password' });
  }
  // Actions----------------
  async changepassword(currentpassword: string, newpassword: string, confirmpassword: string) {


    await this.page.waitForURL('https://staging.dev-tpac.xyz/change-password', { timeout: 10000 }); // waitin for placeholders

    await this.currentpass.fill(currentpassword);
    await this.newpass.fill(newpassword);
    await this.confirmpass.fill(confirmpassword);
    await this.updatebutton.click();

  }

  async assertchangepass() {
    await this.page.getByText('Password changed successfully').waitFor({ timeout: 5000 });
  }
}