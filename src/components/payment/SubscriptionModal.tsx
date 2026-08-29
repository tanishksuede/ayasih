import { useState } from 'react';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import { useUserStore } from '../../store/userStore';
import { Loader2, X, CheckCircle2, Sparkles } from 'lucide-react';
import { getSubscriptionPlanDetails } from '../../services/accessControl';
import { AYAPLUS_BENEFITS, PRICING_DISPLAY } from '../../config/recommendationConfig';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const userProfile = useUserStore((state: any) => state.profile);

  const plans = getSubscriptionPlanDetails();

  if (!isOpen) return null;

  const handleSubscribe = async (planId: string, amount: number) => {
    try {
      setLoadingPlan(planId);
      setError(null);
      
      let formattedPhone = '9999999999';
      if (userProfile?.mobile) {
        const digitsOnly = userProfile.mobile.replace(/\D/g, '');
        if (digitsOnly.length > 10) {
          formattedPhone = digitsOnly.slice(-10);
        } else if (digitsOnly.length === 10) {
          formattedPhone = digitsOnly;
        }
      }

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
          customer_phone: formattedPhone,
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
      const cashfree = await load({
        mode: import.meta.env.VITE_CASHFREE_MODE || 'production', 
      });

      // 3. Initiate checkout
      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self',
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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-purple-500/30 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar my-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>AYA+ Life Navigation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Full DNA & Journey</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm">
            Experience unlimited problem-matching, deep behavioral dissonance insights, longitudinal Emerging You trajectories, and advanced career direction exploration.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-8">
          
          {/* 1. Monthly Plan */}
          <div className="flex flex-col bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 hover:border-purple-400/50 transition-all flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plans.monthly.currency}{plans.monthly.amount}</span>
                <span className="text-slate-400 text-xs">/month</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-2.5 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Unlimited story problem matching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>You Surprised Yourself insights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Emerging You trait trajectories</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSubscribe(plans.monthly.id, plans.monthly.amount)}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider text-white bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingPlan === plans.monthly.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Monthly'}
            </button>
          </div>

          {/* 2. Annual Plan (Hero / Most Popular) */}
          <div className="flex flex-col bg-gradient-to-b from-purple-900/30 via-slate-800/80 to-slate-900 rounded-2xl border-2 border-purple-500 p-6 relative shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all flex-1">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Best Value · Save 58%
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-purple-300 mb-1">AYA+ Annual</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plans.annual.currency}{plans.annual.amount}</span>
                <span className="text-slate-400 text-xs">/year ({PRICING_DISPLAY.annual_monthly_equiv})</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-2.5 mb-6 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Everything in AYA+</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Weekly Growth Recap & Trends</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Priority Access to New Stories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Full Career Archetype Explorer</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSubscribe(plans.annual.id, plans.annual.amount)}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loadingPlan === plans.annual.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Annual Access'}
            </button>
          </div>

          {/* 3. One-Time Report */}
          <div className="flex flex-col bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 hover:border-amber-400/50 transition-all flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-amber-300 mb-1">DNA & Career Report</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plans.dnaReport.currency}{plans.dnaReport.amount}</span>
                <span className="text-slate-400 text-xs">one-time</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-2.5 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Complete 8-page Genomic PDF Dossier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Detailed Behavioral Strengths & Blindspots</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Potentially Aligned Career Pathways</span>
              </li>
            </ul>

            <button 
              onClick={() => handleSubscribe(plans.dnaReport.id, plans.dnaReport.amount)}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingPlan === plans.dnaReport.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unlock Report'}
            </button>
          </div>

        </div>

        {/* Value Comparison Accordion */}
        <div className="border-t border-white/10 pt-4 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs text-purple-300 hover:text-white underline font-semibold transition-colors"
          >
            {showComparison ? 'Hide Plan Comparison' : 'Compare Free vs AYA+ Features'}
          </button>

          {showComparison && (
            <div className="mt-4 text-left overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 uppercase">
                    <th className="py-2">Feature</th>
                    <th className="py-2 text-center">Free</th>
                    <th className="py-2 text-center text-purple-400">AYA+</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {AYAPLUS_BENEFITS.map(b => (
                    <tr key={b.key}>
                      <td className="py-2 font-medium text-white">{b.label}</td>
                      <td className="py-2 text-center text-slate-500">{b.free}</td>
                      <td className="py-2 text-center text-emerald-400 font-bold">Included</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
