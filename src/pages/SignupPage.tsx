import { useState, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { AuthMascot } from '../components/auth/AuthMascot';
import { UsernameField } from '../components/game/UsernameField';
import { useUsernameAvailability } from '../hooks/useUsernameAvailability';
import { authService } from '../services/authService';
import { audioManager as audioSynth } from '../utils/audioManager';

export function SignupPage() {
    const navigate = useNavigate();

    const [authMode, setAuthMode] = useState<'choice' | 'form'>('choice');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mobile, setMobile] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isHoveringBtn, setIsHoveringBtn] = useState(false);

    // Live username availability check
    const usernameAvailability = useUsernameAvailability(
        authMode === 'form' ? username : '',
        null
    );

    const handleGoogleSignUp = async () => {
        audioSynth.playClick();
        setIsLoading(true);
        setError('');
        try {
            await authService.signInWithGoogle(`${window.location.origin}/signup/complete`);
        } catch (err: any) {
            console.error('Google Sign-Up Error:', err);
            setError(err.message || 'Failed to initialize Google Sign-Up.');
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        audioSynth.playClick();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (usernameAvailability.status !== 'available' && username.trim().length >= 3) {
            setError('Please choose an available username.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.signUpWithUsernamePassword({
                username,
                password,
                confirmPassword,
                mobile,
            });
            // Redirect to existing AYA application dashboard
            navigate('/game');
        } catch (err: any) {
            console.error('Signup Error:', err);
            setError(err.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    const baseInputClasses = "w-full bg-black/40 border border-[#2b2b38] rounded-xl px-4 py-3 text-white placeholder-[#76747f] font-medium outline-none transition-all duration-300 hover:border-[#9333ea]/50 hover:bg-black/60 focus:ring-2 focus:ring-[#00f1fe]/40 focus:border-[#00f1fe]";

    return (
        <div className="w-full bg-[#0a0a0f] selection:bg-[#00f1fe] selection:text-black">
            {/* Fixed ambient background layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                    className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#9333ea] opacity-20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-[#00f1fe] opacity-10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[80%] h-[50%] bg-[#ff00ff] opacity-10 blur-[150px] rounded-full" />
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full min-h-[100dvh] flex flex-col md:flex-row items-center justify-center py-16 px-4 gap-8 lg:gap-16">
                
                {/* Auth Card Container */}
                <div className="w-full" style={{ maxWidth: '460px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(0,241,254,0.4)] leading-tight"
                            >
                                Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f1fe] to-[#9333ea]">AYA</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/60 text-sm mt-2 font-medium"
                            >
                                Create your account to start your journey
                            </motion.p>
                        </div>

                        {/* Error Alert */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 bg-red-900/40 text-red-200 rounded-2xl border border-red-500/50 backdrop-blur-md text-center text-sm font-bold shadow-xl"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mode Choice View */}
                        {authMode === 'choice' && (
                            <div className="space-y-4 w-full">
                                {/* Google Sign Up */}
                                <motion.button
                                    onMouseEnter={() => setIsHoveringBtn(true)}
                                    onMouseLeave={() => setIsHoveringBtn(false)}
                                    onTouchStart={() => setIsHoveringBtn(true)}
                                    onTouchEnd={() => setIsHoveringBtn(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    onClick={handleGoogleSignUp}
                                    className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl shadow-lg flex items-center justify-center space-x-3 transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span>INITIALIZING...</span>
                                    ) : (
                                        <>
                                            <img
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                alt="Google"
                                                className="w-7 h-7"
                                            />
                                            <span>CONTINUE WITH GOOGLE</span>
                                        </>
                                    )}
                                </motion.button>

                                <div className="flex items-center gap-4 my-2 opacity-40 w-full">
                                    <div className="h-px bg-white flex-1" />
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">OR</span>
                                    <div className="h-px bg-white flex-1" />
                                </div>

                                {/* Username & Password Option */}
                                <motion.button
                                    onMouseEnter={() => setIsHoveringBtn(true)}
                                    onMouseLeave={() => setIsHoveringBtn(false)}
                                    onTouchStart={() => setIsHoveringBtn(true)}
                                    onTouchEnd={() => setIsHoveringBtn(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        audioSynth.playClick();
                                        setAuthMode('form');
                                    }}
                                    className="w-full py-4 bg-transparent border-2 border-[#2b2b38] text-white font-bold text-base rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <User size={20} className="text-[#00f1fe]" />
                                    <span>CONTINUE WITH USERNAME & PASSWORD</span>
                                </motion.button>
                            </div>
                        )}

                        {/* Username + Password Signup Form */}
                        {authMode === 'form' && (
                            <form onSubmit={handleFormSubmit} className="space-y-4 w-full">
                                {/* Username */}
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#9333ea]/40 transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(147,51,234,0.4)]"
                                >
                                    <UsernameField
                                        value={username}
                                        onChange={setUsername}
                                        status={usernameAvailability.status}
                                        errorMessage={usernameAvailability.errorMessage}
                                        disabled={isLoading}
                                        label="Username"
                                        helperText="Choose a unique handle (3–20 chars)"
                                    />
                                </motion.div>

                                {/* Password */}
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00f1fe]/40 transition-all duration-300"
                                >
                                    <label className="block text-[11px] font-bold text-[#00f1fe] mb-2 uppercase tracking-[0.15em] flex items-center gap-1.5">
                                        <Lock size={12} /> Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            className={`${baseInputClasses} pr-12`}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 text-[#acaab5] hover:text-[#00f1fe] transition-colors p-1 rounded-lg"
                                            title={showPassword ? "Hide password" : "Show password"}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Confirm Password */}
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00f1fe]/40 transition-all duration-300"
                                >
                                    <label className="block text-[11px] font-bold text-[#00f1fe] mb-2 uppercase tracking-[0.15em] flex items-center gap-1.5">
                                        <Lock size={12} /> Confirm Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                            className={`${baseInputClasses} pr-12`}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 text-[#acaab5] hover:text-[#00f1fe] transition-colors p-1 rounded-lg"
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Optional Phone Number */}
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00f1fe]/40 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-[11px] font-bold text-[#00f1fe] uppercase tracking-[0.15em] flex items-center gap-1.5">
                                            <Phone size={12} /> Phone Number
                                        </label>
                                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Optional</span>
                                    </div>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={mobile}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
                                        className={baseInputClasses}
                                        placeholder="E.g. +91 9876543210"
                                        disabled={isLoading}
                                    />
                                </motion.div>

                                {/* Submit Button */}
                                <motion.button
                                    onMouseEnter={() => setIsHoveringBtn(true)}
                                    onMouseLeave={() => setIsHoveringBtn(false)}
                                    onTouchStart={() => setIsHoveringBtn(true)}
                                    onTouchEnd={() => setIsHoveringBtn(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,241,254,0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading || usernameAvailability.status !== 'available' || !password || password !== confirmPassword}
                                    type="submit"
                                    className="w-full py-4 bg-[#00f1fe] text-[#004145] font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(0,241,254,0.35)] flex items-center justify-center space-x-2 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7ff9ff] transition-all mt-4"
                                >
                                    <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                                    {!isLoading && <Check size={22} className="stroke-[3]" />}
                                </motion.button>

                                {/* Toggle Back */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        audioSynth.playClick();
                                        setAuthMode('choice');
                                    }}
                                    className="w-full py-2 text-white/50 hover:text-white/80 font-semibold text-xs rounded-full transition-all text-center"
                                >
                                    ← Choose another method
                                </button>
                            </form>
                        )}

                        {/* Navigation link to Sign In */}
                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm font-medium">
                                Already have an account?{' '}
                                <Link
                                    to="/signin"
                                    onClick={() => audioSynth.playClick()}
                                    className="text-[#00f1fe] font-bold hover:underline ml-1"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* AYA Mascot Sidekick */}
                <AuthMascot isHappy={isHoveringBtn} />
            </div>
        </div>
    );
}
