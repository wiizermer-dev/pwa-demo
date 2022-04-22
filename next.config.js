const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    // customWorkerDir: 'worker' default
    register: true,
    skipWaiting: true,
    runtimeCaching,
  },
})
