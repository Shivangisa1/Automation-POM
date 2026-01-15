import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "../Pages/Forgotpage";

test.describe("Forgot Password Tests", () => {
  test("Test case 1: should send reset link for valid email", async ({ page }) => {
    const forgotPassword = new ForgotPasswordPage(page);

    await forgotPassword.goto();
    await forgotPassword.requestReset("Shivangi.saraswat@desklay.com");
    await forgotPassword.assertErrorMessage();



  });

  test("Test case 2: should throw messag for invalid email", async ({ page }) => {
    const forgotPassword = new ForgotPasswordPage(page);

    await forgotPassword.goto();
    await forgotPassword.requestReset("admin@mailinator.com");

    await forgotPassword.assertResetSuccess();
    expect(await page.url()).toContain("/forgot-password");


  });

});