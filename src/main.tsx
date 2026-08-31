import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { syncExistingSubscriptionIfGranted } from './utils/pushNotifications.ts';

const FORCE_RELOAD_VERSION = 'v1.1.6';

// iOS Safari guard: prevent infinite reload loop
// Only allow a version-bump reload once every 10 seconds
const lastReloadTime = (() => { try { return parseInt(sessionStorage.getItem('aya_last_reload') || '0', 10); } catch { return 0; } })();
const reloadCooldownOk = Date.now() - lastReloadTime > 10000;

try {
    const storedVersion = localStorage.getItem('aya_pwa_version');
    if (storedVersion !== FORCE_RELOAD_VERSION && reloadCooldownOk) {
        localStorage.setItem('aya_pwa_version', FORCE_RELOAD_VERSION);

        // Wipe out the levels array in the Zustand store so it gets re-fetched or re-generated
        try {
            const storeStr = localStorage.getItem('aya-user-store');
            if (storeStr) {
                const store = JSON.parse(storeStr);
                if (store.state && Array.isArray(store.state.levels)) {
                    store.state.levels = [];
                    localStorage.setItem('aya-user-store', JSON.stringify(store));
                    console.log('[Cache Clear] Wiped levels from local storage');
                }
            }
        } catch (e) {
            console.error('[Cache Clear] Failed to parse local store', e);
        }

        // Record reload time before reloading (prevents iOS loop)
        try { sessionStorage.setItem('aya_last_reload', String(Date.now())); } catch {}

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
                window.location.reload();
            }).catch(() => window.location.reload());
        } else {
            window.location.reload();
        }
    }
} catch (e) {
    // localStorage blocked (iOS Private Mode) — skip version check, just boot normally
    console.warn('[AYA Boot] localStorage unavailable, skipping version check:', e);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('[SW] Service Worker registered with scope:', registration.scope);
        // Force checking for updates from Vercel immediately
        registration.update().catch(() => {});
        // Sync existing subscription if permission was previously granted (without creating new subscriptions on load)
        syncExistingSubscriptionIfGranted();
      },
      (error) => {
        console.error('[SW] Service Worker registration failed:', error);
      }
    );
  });
}

// Global Error Handler moved to index.html for better coverage

// ============================================================
// iOS Safari Viewport Height Fix
// Must run before React renders
// ============================================================
function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set on load
setVhVariable();

// Update on resize (iOS fires this when address bar shows/hides)
window.addEventListener('resize', setVhVariable, { passive: true });
window.addEventListener('orientationchange', () => {
  setTimeout(setVhVariable, 200); // Delay for iOS orientation animation
}, { passive: true });

try {
  console.log('[AYA Boot] localStorage aya_user_id:', localStorage.getItem('aya_user_id'));
  console.log('[AYA Boot] sessionStorage aya_user_id:', sessionStorage.getItem('aya_user_id'));
  console.log('[AYA Boot] Zustand persisted store:', localStorage.getItem('aya-user-store'));
} catch (e) {
  console.warn('[AYA Boot] Storage not accessible (iOS Private Mode?):', e);
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
