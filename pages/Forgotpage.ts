import { Page, Locator } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly resetButton: Locator;
  readonly errormessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("Email address");
    this.resetButton = page.getByRole("button", { name: "Get Password Reset Link" }); // for positive test
    this.errormessage = page.getByText("No user found with this email address."); // for negative test
  }

  async goto() {
    await this.page.goto("https://staging.dev-tpac.xyz/forgot-password");
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.resetButton.click();
  }

  async assertResetSuccess() {
    await this.page.getByText("A password reset link has been sent to your email.").waitFor({ timeout: 5000 });
  }

  async assertErrorMessage() {
    await this.page.getByText("No user found with this email address.").waitFor({ timeout: 5000 });
  }
}