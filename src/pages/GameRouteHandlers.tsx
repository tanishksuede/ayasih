import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { LevelMap } from '../components/game/LevelMap';
import { PersonalityIntro } from '../components/game/PersonalityIntro';
import { ScenarioGame } from '../components/game/ScenarioGame';
import { MatchReport } from '../components/game/MatchReport';
import { ProfileDashboard } from '../components/game/ProfileDashboard';
import { DnaProfile } from '../components/game/DnaProfile';
import { CharacterSelection } from '../components/game/CharacterSelection';
import { MoodWheel } from '../components/MoodWheel/MoodWheel';
import { DailyChallengeReveal } from '../components/game/DailyChallengeReveal';
import { LevelUpCelebration } from '../components/game/LevelUpCelebration';
import { calculateLevelInfo } from '../utils/levelSystem';

export function MapRouteHandler() {
    const navigate = useNavigate();
    const setShowSubscriptionModal = useUserStore((state) => state.setShowSubscriptionModal);
    
    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('hasSeenSubscriptionPopup');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setShowSubscriptionModal(true);
                sessionStorage.setItem('hasSeenSubscriptionPopup', 'true');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [setShowSubscriptionModal]);

    return (
        <LevelMap 
            onPlayLevel={(level) => navigate(`/game/intro/${level.id}`)} 
            onOpenDnaProfile={() => navigate('/game/dna')}
        />
    );
}

export function IntroRouteHandler() {
    const { id } = useParams();
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    
    const level = levels.find((l) => String(l.id) === String(id));
    if (!level) return <Navigate to="/game" replace />;

    return (
        <PersonalityIntro 
            level={level} 
            onStart={() => navigate(`/game/play/${level.id}`)} 
            onBack={() => navigate('/game')} 
        />
    );
}

export function PlayRouteHandler() {
    const { id } = useParams();
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    const completeLevel = useUserStore((state) => state.completeLevel);
    const unlockLevel = useUserStore((state) => state.unlockLevel);
    const setPendingStreakData = useUserStore((state) => state.setPendingStreakData);
    
    const level = levels.find((l) => String(l.id) === String(id));
    if (!level) return <Navigate to="/game" replace />;

    const handleComplete = (stars: number) => {
        completeLevel(level.id, stars);
        const currentIndex = levels.findIndex(l => l.id === level.id);
        if (currentIndex !== -1 && currentIndex < levels.length - 1) {
            unlockLevel(levels[currentIndex + 1].id);
        }
        navigate(`/game/report/${level.id}`);
    };

    return (
        <ScenarioGame 
            level={level} 
            onComplete={handleComplete} 
            onBack={() => navigate('/game')} 
            onDailyChallengeComplete={setPendingStreakData} 
        />
    );
}

export function ReportRouteHandler() {
    const { id } = useParams();
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    const profile = useUserStore((state) => state.profile);
    
    const level = levels.find((l) => String(l.id) === String(id));
    if (!level || !profile) return <Navigate to="/game" replace />;

    return (
        <MatchReport
            userTraits={profile.traits}
            userProfile={profile.psychologicalProfile}
            idolTraits={level.idolTraits || { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 }}
            idolName={level.personality || level.archetype}
            onClose={() => navigate('/game')}
        />
    );
}

export function DnaRouteHandler() {
    const navigate = useNavigate();
    const profile = useUserStore((state) => state.profile);
    if (!profile) return <Navigate to="/game" replace />;

    return <DnaProfile onBack={() => navigate('/game')} />;
}

export function ProfileRouteHandler() {
    const navigate = useNavigate();
    const profile = useUserStore((state) => state.profile);
    if (!profile) return <Navigate to="/game" replace />;

    return <ProfileDashboard onBack={() => navigate('/game')} />;
}

export function SelectionRouteHandler() {
    const { age } = useParams();
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    
    if (!age) return <Navigate to="/game" replace />;
    const activeAge = parseInt(age, 10);
    
    return (
        <CharacterSelection 
            age={activeAge}
            options={levels.filter(l => Number(l.age) === Number(activeAge))}
            onSelect={(level) => navigate(`/game/intro/${level.id}`)}
            onBack={() => navigate('/game')}
        />
    );
}

export function MoodRouteHandler() {
    const navigate = useNavigate();
    const profile = useUserStore((state) => state.profile);
    if (!profile) return <Navigate to="/game" replace />;

    return (
        <MoodWheel
            userId={profile.id || ''}
            userAge={profile.age || 18}
            onMoodSelected={(mood) => {
                navigate('/game/daily-reveal', { state: { mood } });
            }}
            onClose={() => navigate(-1)}
        />
    );
}

export function DailyRevealRouteHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const mood = location.state?.mood;
    
    if (!mood) return <Navigate to="/game" replace />;

    return (
        <DailyChallengeReveal
            mood={mood}
            onClose={() => navigate(-1)}
            onComplete={(level) => navigate(`/game/intro/${level.id}`)}
        />
    );
}

export function LevelUpRouteHandler() {
    const navigate = useNavigate();
    const profile = useUserStore((state) => state.profile);

    if (!profile) return <Navigate to="/game" replace />;

    const levelInfo = calculateLevelInfo(profile.level || 1);

    return (
        <div className="w-full min-h-[100dvh] bg-slate-950">
            <LevelUpCelebration
                levelName={levelInfo.title}
                levelNumber={profile.level || 1}
                onComplete={() => navigate(-1)}
            />
        </div>
    );
}

export { AdminPanelPage as AdminRouteHandler } from './AdminPanelPage';