import type { CapacitorConfig } from '@capacitor/cli'

const isDev = process.env.NODE_ENV !== 'production'

const config: CapacitorConfig = {
  appId: 'com.leonatelier.app',
  appName: 'Leon Atelier',
  webDir: 'out',
  bundledWebRuntime: false,
  // Dev: Next.js on host (emulator uses 10.0.2.2). Prod: load deployed site.
  server: isDev
    ? { url: 'http://10.0.2.2:3000', cleartext: true }
    : { url: 'https://leonatelier.netlify.app' },
  android: {
    allowMixedContent: false,
  },
}

export default config
