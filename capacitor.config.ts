
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0feae9bea71c45d0a048bdd362291df3',
  appName: 'mana-master-tracker',
  webDir: 'dist',
  server: {
    url: 'https://0feae9be-a71c-45d0-a048-bdd362291df3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e1b4b',
      showSpinner: false
    }
  }
};

export default config;
