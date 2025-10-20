import type { CapacitorConfig } from '@capacitor/cli'

const isDev = process.env.NODE_ENV !== 'production'

const config: CapacitorConfig = {
  appId: 'com.leonatelier.app',
  appName: 'Leon Atelier',
  webDir: 'out', // next export output
  bundledWebRuntime: false,
  // In development, load from the Next.js dev server. On Android emulator, host is 10.0.2.2
  server: isDev ? { url: 'http://10.0.2.2:3000', cleartext: true } : undefined,
  android: {
    allowMixedContent: false,
  },
}

export default config
