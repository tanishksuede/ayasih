import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');
  useEffect(() => {
    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) return setStatus('denied');
      const { data, error } = await supabase.rpc('is_admin_user', { check_email: session.user.email });
      setStatus(!error && data ? 'allowed' : 'denied');
    };
    void verify().catch(() => setStatus('denied'));
  }, []);
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-black text-white">Verifying access...</div>;
  return status === 'allowed' ? <>{children}</> : <Navigate to="/game" replace />;
}
