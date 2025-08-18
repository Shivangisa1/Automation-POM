import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://practice.expandtesting.com/login',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});