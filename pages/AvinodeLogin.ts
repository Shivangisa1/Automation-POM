import { expect, Page } from '@playwright/test';

export async function avinodeLogin(page: Page) {

  await page.goto(
    'https://sandbox.avinode.com/sso/mvc/login/required?go=https%3A%2F%2Fsandbox.avinode.com%2Findustry%2Fpage%2Fhomeview'
  );
  await page.getByRole('textbox', { name: 'Login*' }).fill('awais.ansari@desklay.com');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: 'password' }).fill('Iamlama/7/');
  await page.getByRole('button', { name: 'Log in with password' }).click();
  await page.waitForLoadState('networkidle', {timeout : 5000});

}
