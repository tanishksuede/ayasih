import { supabase } from './supabase';
import { useUserStore } from '../store/userStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a URL-safe base64 VAPID public key to the Uint8Array that
 * pushManager.subscribe() expects as `applicationServerKey`.
 *
 * This is the canonical implementation — matches the web-push npm package
 * and the W3C Push API spec exactly.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type PushNotificationState = 'unsupported' | 'granted' | 'denied' | 'default';

/**
 * Check if the current browser supports Web Push notifications.
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Get current browser notification permission state.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check browser support and current Notification permission status.
 */
export function getNotificationSupportStatus(): PushNotificationState {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission as PushNotificationState;
}

/**
 * Retrieve current active push subscription if one exists.
 */
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Unsubscribe current browser device from push notifications.
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    if (!isPushSupported()) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      // Delete from backend Supabase table
      try {
        await fetch('/api/subscribe-push', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint })
        });
      } catch (err) {
        console.warn('[Push] Error deleting subscription from DB:', err);
      }

      console.log('[Push] Unsubscribed successfully.');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[Push] unsubscribeFromPush failed:', err);
    return false;
  }
}

export async function subscribeToPush(userId?: string): Promise<PushSubscription | null> {
  return subscribeUserToPush(userId);
}

export async function subscribeUserToPush(passedUserId?: string): Promise<PushSubscription | null> {
  console.log('[Push] Starting subscription...');

  try {
    // ── 1. Feature-detect ──────────────────────────────────────────────────
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      console.error('[Push] FAIL — Web push features not supported in this browser.');
      return null;
    }

    // If permission is already denied, do not prompt repeatedly
    if (Notification.permission === 'denied') {
      console.warn('[Push] Notification permission has been denied by the user.');
      return null;
    }

    // ── 2. Validate VAPID key ──────────────────────────────────────────────
    const DEFAULT_VAPID_KEY = 'BKuBEyjIX-OtnnyJ7cyBMLwAycYv6POyGVFIxPnlzbReZLxv3S-QP9wcJ-YIE38w_al1tqIDwSf41MUG8JgipZE';
    const VAPID_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) || DEFAULT_VAPID_KEY;
    console.log('[Push] Using VAPID key prefix:', VAPID_KEY.substring(0, 15));

    // ── 3. Wait for or register the service worker ─────────────────────────
    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.ready;
    } catch {
      registration = await navigator.serviceWorker.register('/sw.js');
    }

    // ── 4. Request notification permission ────────────────────────────────
    console.log('[Push] Requesting Notification permission…');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Push] User did not grant permission. Permission state:', permission);
      return null;
    }

    // ── 5. Convert VAPID key ───────────────────────────────────────────────
    let applicationServerKey: Uint8Array;
    try {
      applicationServerKey = urlBase64ToUint8Array(VAPID_KEY);
    } catch (e) {
      console.error('[Push] VAPID key conversion failed:', e);
      throw e;
    }

    // ── 6. Subscribe ───────────────────────────────────────────────────────
    console.log('[Push] Calling pushManager.subscribe()…');
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as BufferSource,
      });
    }
    
    console.log('[Push] Subscribed successfully. Endpoint:', subscription.endpoint.slice(0, 40) + '…');

    // ── 7. Persist via server-side API ──────────────────────────────────────
    let targetUserId: string | null = passedUserId || useUserStore.getState().profile?.id || localStorage.getItem('aya_user_id') || null;
    
    if (!targetUserId) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) targetUserId = authUser.id;
      } catch (e) {
        console.warn('[Push] Auth check failed:', e);
      }
    }

    const subJson = subscription.toJSON();

    try {
      const apiRes = await fetch('/api/subscribe-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subJson, userId: targetUserId })
      });

      if (!apiRes.ok) {
        // Fallback endpoint if needed
        await fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subJson, userId: targetUserId })
        });
      }

      console.log('[Push] Subscription stored in database.');
    } catch (apiErr) {
      console.error('[Push] Network error saving subscription to DB:', apiErr);
    }

    return subscription;

  } catch (err) {
    console.error('[Push] subscribeUserToPush() failed:', err);
    return null;
  }
}

/**
 * Trigger an instant test notification on the user's device.
 */
export async function sendTestNotification(): Promise<boolean> {
  try {
    if (!('Notification' in window)) {
      alert("Notifications are not supported by this browser.");
      return false;
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      alert("Notification permission is not granted. Please allow notifications in your browser settings!");
      return false;
    }

    // Attempt 1: Service Worker Notification
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification('🌟 AYA Notifications Active!', {
            body: 'Welcome! You will receive daily mindset reminders and streak alerts.',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            tag: 'aya-test-notification'
          } as NotificationOptions);
          return true;
        }
      } catch (swErr) {
        console.warn('[Push] ServiceWorker showNotification failed, falling back to window Notification:', swErr);
      }
    }

    // Attempt 2: Direct Window Notification fallback
    new Notification('🌟 AYA Notifications Active!', {
      body: 'Welcome! You will receive daily mindset reminders and streak alerts.',
      icon: '/icons/icon-192.png'
    });
    return true;
  } catch (err: any) {
    console.error('[Push] Failed to show test notification:', err);
    alert('Could not show notification: ' + (err?.message || err));
    return false;
  }
}

/**
 * Silently subscribe and register push notifications if permission is already granted.
 */
export async function autoSubscribeIfGranted(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    console.log('[Push] Permission already granted — auto-registering device...');
    try {
      await subscribeUserToPush();
    } catch (e) {
      console.warn('[Push] Auto-subscription silent error:', e);
    }
  }
}

