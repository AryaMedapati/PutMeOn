module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      module.exports = {
        e2e: {
          baseUrl: 'http://localhost:5002',
          viewportWidth: 1280,
          viewportHeight: 720,
          defaultCommandTimeout: 10000,
          retries: {
            runMode: 2,
            openMode: 1,
          },
          video: true,
          screenshots: true,
        },
      }
      
    },
  },
};
