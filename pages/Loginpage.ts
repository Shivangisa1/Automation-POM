import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    //this.usernameInput = page.locator('#username');  // locators has some issue

    this.usernameInput = page.getByPlaceholder('Enter your email address');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });

  }

  /*async goto() {
    await this.page.goto('/public/');
  }*/

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    // await this.page.waitForURL('**/public/Dashboard');

    await this.page.waitForURL(/.*\/dashboard/i, { timeout: 10000 });
    await this.page.getByText('Welcome, Admin').waitFor({ timeout: 5000 });
  }
  async assertLoginFailure() {
    await this.page.locator('.error-message').isVisible();
  }
}