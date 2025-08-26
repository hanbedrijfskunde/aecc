// Playwright configuration
module.exports = {
  testDir: './tests',
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:8000',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'python -m http.server 8000 --directory docs',
    port: 8000,
    reuseExistingServer: !process.env.CI,
  },
};