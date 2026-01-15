import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/Loginpage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => { // to run before each test
    loginPage = new LoginPage(page);
    //await loginPage.goto();
  });
  /*
    test('Test case 1: should log in with valid credentials', async () => {
      await loginPage.login('admin@mailinator.com', 'Tpac@123');
      await loginPage.assertLoginSuccess();
      expect(await loginPage.page.url()).toContain('/dashboard'); // Case sensitive
  
      await loginPage.page.screenshot({ path: 'screenshots/login-success.png' }); //  working currently
      await loginPage.page.close(); // no need to add this page close in after each because playwright automatically closes the browser after each test
    });*/


  test('Test case 2: should not log in with invalid credentials', async () => {
    await loginPage.login('invalidUser', 'invalidPassword');
    expect(await loginPage.page.url()).not.toContain('/Dashboard');
  });

  test('Test case 3: should show error message on failed login', async () => {
    await loginPage.login('invalidUser', 'invalidPassword');
    await loginPage.assertLoginFailure();
  });
}
);