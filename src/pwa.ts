import { registerSW } from 'virtual:pwa-register';

// Register the service worker immediately and auto-reload the app when a new
// version is deployed (Netlify build). The plugin is already configured with
// `registerType: "autoUpdate"`, so once the new SW activates it will trigger a
// reload of all open tabs.

registerSW({
  immediate: true,
  onRegistered(swRegistration) {
    // Optionally, check periodically for updates (every 60 min)
    if (swRegistration) {
      setInterval(() => {
        swRegistration.update();
      }, 60 * 60 * 1000);
    }
  },
}); 