import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NotificationPrompt } from '../components/ui/NotificationPrompt';
import { subscribeUserToPush } from '../utils/pushNotifications';
import { safeStorage } from '../utils/storage';
import { useUserStore } from '../store/userStore';

const NOTIF_KEY = 'aya_daily_notif_prompt_date';

export function HomePage() {
    const navigate = useNavigate();
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
            <div className="h-[100dvh] w-full p-6 flex flex-col items-center justify-center pt-12 pb-24">
                <div className="w-full space-y-4 mx-auto" style={{ maxWidth: '450px' }}>
                    <FeatureCard
                        title="Start The Game"
                        subtitle="Interactive Story Mode"
                        icon={Gamepad2}
                        color="bg-gradient-to-r from-pink-600 to-rose-600"
                        onClick={() => navigate('/game')}
                    />
                </div>
            </div>

            <NotificationPrompt
                isOpen={showNotificationPrompt}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
        </>
    );
}

function FeatureCard({ title, subtitle, icon: Icon, color, onClick, status }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-8 rounded-3xl text-left relative overflow-hidden group transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl ${color}`}
        >
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner blur-[0.5px]">
                    <Icon className="text-white drop-shadow-md" size={32} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-wide uppercase drop-shadow-md">{title}</h3>
                <p className="text-white/90 text-sm font-medium tracking-widest uppercase">{subtitle}</p>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-3xl rounded-full pointer-events-none" />

            {status && (
                <div className="absolute top-4 right-4 bg-black/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {status}
                </div>
            )}
        </button>
    );
}
