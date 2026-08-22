import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

import { HomePage } from './pages/Home';
import { GameRoot } from './pages/GameRoot';
import { bgmManager } from './utils/bgmManager';
import { MapRouteHandler, IntroRouteHandler, PlayRouteHandler, ReportRouteHandler, DnaRouteHandler, SelectionRouteHandler, MoodRouteHandler, DailyRevealRouteHandler, LevelUpRouteHandler, AdminRouteHandler } from './pages/GameRouteHandlers';
import { OnboardingWizard } from './components/game/OnboardingWizard';
import { CinematicOnboarding } from './components/game/CinematicOnboarding';
import { PersonalityAssessment } from './components/game/PersonalityAssessment';
import { SettingsPage } from './pages/SettingsPage';
import { JournalPage } from './pages/JournalPage';
import { ThemeSwitcherPage } from './pages/ThemeSwitcherPage';
import { NotificationOnboardingPage } from './pages/NotificationOnboardingPage';
import { SocialPage } from './pages/SocialPage';
import { FeedbackDashboard } from './components/admin/FeedbackDashboard';
import ReactGA from 'react-ga4';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { GoogleTranslateSync } from './components/GoogleTranslateSync';

// Initialize Google Analytics 4
ReactGA.initialize('G-30ZXCBJXSQ');

function App() {
  useEffect(() => {
    bgmManager.loadPreference()
    
    // Purge any legacy browser/service-worker audio caches on startup
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (key.includes('music') || key.includes('audio') || key.includes('workbox')) {
            caches.delete(key);
          }
        });
      }).catch(() => {});
    }

    // Unlock on user interactions (keeps audio context alive on mobile)
    const unlock = async () => {
      await bgmManager.unlock()
    }
    
    document.addEventListener('click', unlock, { capture: true, passive: true })
    document.addEventListener('touchstart', unlock, { capture: true, passive: true })
    
    return () => {
      document.removeEventListener('click', unlock, { capture: true })
      document.removeEventListener('touchstart', unlock, { capture: true })
    }
  }, [])

  return (
    <BrowserRouter>
      <GoogleTranslateSync />
      <AnalyticsTracker />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GameRoot />}>
            <Route index element={<MapRouteHandler />} />
            <Route path="welcome" element={<OnboardingWizard />} />
            <Route path="setup" element={<OnboardingWizard />} />
            <Route path="notifications" element={<NotificationOnboardingPage />} />
            <Route path="onboarding/:step" element={<CinematicOnboarding />} />
            <Route path="onboarding" element={<Navigate to="/game/onboarding/1" replace />} />
            <Route path="assessment/:step" element={<PersonalityAssessment />} />
            <Route path="intro/:id" element={<IntroRouteHandler />} />
            <Route path="play/:id" element={<PlayRouteHandler />} />
            <Route path="report/:id" element={<ReportRouteHandler />} />
            <Route path="dna" element={<DnaRouteHandler />} />
            <Route path="selection/:age" element={<SelectionRouteHandler />} />
            <Route path="mood" element={<MoodRouteHandler />} />
            <Route path="daily-reveal" element={<DailyRevealRouteHandler />} />
            <Route path="level-up" element={<LevelUpRouteHandler />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="theme" element={<ThemeSwitcherPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="admin" element={<AdminRouteHandler />} />
            <Route path="admin/feedback" element={<FeedbackDashboard />} />
            <Route path="*" element={<Navigate to="/game" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
