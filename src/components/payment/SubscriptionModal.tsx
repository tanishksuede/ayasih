import { useState } from 'react';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import { useUserStore } from '../../store/userStore';
import { Loader2, X, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userProfile = useUserStore((state: any) => state.profile);

  if (!isOpen) return null;

  const handleSubscribe = async (planId: string, amount: number) => {
    try {
      setLoadingPlan(planId);
      setError(null);
      
      // 1. Get payment_session_id from our Vercel API
      const response = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_id: planId,
          amount: amount,
          user_id: userProfile?.id || 'guest',
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      if (!data.payment_session_id) {
        throw new Error('No payment session ID returned');
      }

      // 2. Initialize Cashfree JS SDK
      // Depending on your environment, use 'sandbox' or 'production'
      const cashfree = await load({
        mode: import.meta.env.VITE_CASHFREE_MODE || 'production', 
      });

      // 3. Initiate checkout
      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self', // Change from _modal to _self to bypass strict iframe whitelisting
      };

      await cashfree.checkout(checkoutOptions);

    } catch (err: any) {
      console.error('Subscription Error:', err);
      setError(err.message || 'Something went wrong while initiating payment.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            Choose Your <span className="text-cyan-400">Path</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            (Testing Mode: No features are actually locked. You can safely explore the app for free. 
            Select a plan to test the Cashfree integration.)
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Premium Plan */}
          <div className="flex flex-col bg-slate-800/50 rounded-2xl border border-white/5 p-6 hover:border-cyan-400/50 transition-colors">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₹49</span>
                <span className="text-white/50">/month</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Ad-free experience</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Unlimited Stories access</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Basic Analytics</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSubscribe('premium', 49)}
              disabled={loadingPlan !== null}
              className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'premium' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Choose Premium'}
            </button>
          </div>

          {/* Premium Pro Plan */}
          <div className="flex flex-col bg-gradient-to-b from-yellow-500/10 to-slate-800/50 rounded-2xl border border-yellow-500/30 p-6 relative shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-shadow">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-2">Premium Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₹99</span>
                <span className="text-white/50">/month</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Detailed Psychometric Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Early Access to New Stories</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Exclusive Avatar Customizations</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSubscribe('premium_pro', 99)}
              disabled={loadingPlan !== null}
              className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'premium_pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Choose Pro'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
