import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: "i1vmce",
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    baseUrl: 'http://localhost:4200',
  },
})
