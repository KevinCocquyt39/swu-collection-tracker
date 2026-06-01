import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.swutracker.app",
  appName: "SWU Tracker",
  webDir: ".output/public",
  android: {
    buildOptions: {
      releaseType: "APK",
    },
  },
};

export default config;
