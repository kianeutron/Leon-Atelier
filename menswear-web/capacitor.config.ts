import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.leonatelier.app',
  appName: 'Leon Atelier',
  webDir: 'out',
  bundledWebRuntime: false,
  // Always load deployed site (works on emulator and physical device)
  server: { url: 'https://leonatelier.netlify.app' },
  android: {
    allowMixedContent: false,
  },
}

export default config
