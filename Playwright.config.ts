import { defineConfig } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results', // Directory for test results like screenshots, videos, traces
  use: {
    baseURL: 'https://staging.dev-tpac.xyz/',  //because we are using one env here..
    headless: true,
    screenshot: 'on',
    trace: 'retain-on-failure', //it tracks on failure only
    video: 'on',

  },

  // To run for different environments:----------

  /*projects: [
    {
      name: 'Staging',
      use: {
        baseURL: 'https://staging.dev-tpac.xyz/public/login',
      },
    },
    {
      name: 'UAT',
      use: {
        baseURL: 'https://qa.dev-tpac.xyz/public/login',
      },
    },
    {
      name: 'prod',
      use: {
        baseURL: 'https://prod.dev-tpac.xyz/public/login',
      },
    },
  ], */

  reporter: [['html', { open: 'never' }], ['list'],
  ['junit', { outputFile: 'results.xml' }],
  ['allure-playwright', { outputFolder: 'allure-results' }]],

  timeout: 30000, //30 seconds default timeout for each test

  // for allure report use below reporter:
  //install npm install -D allure-playwright allure-commandline
  //reporter: [['allure-playwright'], ['list'], ['junit', { outputFile: 'results.xml' }]],

});