
import React, { useState } from 'react';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (accessCode: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Small delay for UX feel if needed, but local is fast
      const success = await onLogin(code.trim());
      if (!success) {
        setError('Invalid access code. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Brand */}
        <div className="flex justify-center mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-emerald-500/20 shadow-lg">
                C
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Concept Market</span>
            </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Family</h1>
              <p className="text-slate-500">Enter your unique access code to begin investing in student projects.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-slate-700 mb-1.5">Access Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="accessCode"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CMC2025"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 font-mono uppercase tracking-wide placeholder-slate-400 bg-slate-50 focus:bg-white"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Enter Market <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Having trouble? Try the demo code <span className="font-mono font-bold text-slate-700">CMC2025</span>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-sm text-slate-400">
          © 2025 Concept Market • Festival of Learning
        </p>

      </div>
    </div>
  );
};

export default Login;