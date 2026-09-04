import { useEffect, useState } from 'react';
import { AyaLanding } from '../components/landing/AyaLanding';
import { NotificationPrompt } from '../components/ui/NotificationPrompt';
import { subscribeUserToPush } from '../utils/pushNotifications';
import { safeStorage } from '../utils/storage';
import { useUserStore } from '../store/userStore';

const NOTIF_KEY = 'aya_daily_notif_prompt_date';

export function HomePage() {
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
    const profile = useUserStore((state) => state.profile);

    useEffect(() => {
        const todayDateStr = new Date().toISOString().split('T')[0];
        const lastPromptDate = safeStorage.get(NOTIF_KEY);
        const permission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied';

        if (lastPromptDate !== todayDateStr && permission !== 'granted' && (profile?.stories_completed || 0) > 0) {
            const timer = setTimeout(() => {
                setShowNotificationPrompt(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [profile?.stories_completed]);

    const handleAccept = async () => {
        const todayDateStr = new Date().toISOString().split('T')[0];
        safeStorage.set(NOTIF_KEY, todayDateStr);
        setShowNotificationPrompt(false);
        await subscribeUserToPush(profile?.id);
    };

    const handleDecline = () => {
        const todayDateStr = new Date().toISOString().split('T')[0];
        safeStorage.set(NOTIF_KEY, todayDateStr);
        setShowNotificationPrompt(false);
    };

    return (
        <>
            <AyaLanding />
            <NotificationPrompt
                isOpen={showNotificationPrompt}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
        </>
    );
}
