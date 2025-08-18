import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  // This block runs before all tests in this describe block
  test.beforeAll(async ({ browser }) => {
    // You can add any setup code here if needed
  });

  // This block runs after all tests in this describe block
  test.afterAll(async ({ browser }) => {
    // You can add any teardown code here if needed
  });
 // 1st case
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('practice', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
    await expect(page).toHaveURL(/.*secure/);
  });

// 2nd case:
  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wronguser', 'wrongpass');

    const errorMsg = page.locator('.error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText(/login/i);
  });
});