
import React, { useState } from 'react';
import { ArrowRight, Lock, AlertCircle, User, CheckCircle } from 'lucide-react';
import { Family } from '../types';

interface LoginProps {
  onLogin: (accessCode: string) => Promise<{ success: boolean; needsRegistration?: boolean; family?: Family }>;
  onClaimCode: (familyId: string, studentName: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClaimCode }) => {
  const [code, setCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Two-step flow state
  const [step, setStep] = useState<'code' | 'register'>('code');
  const [pendingFamily, setPendingFamily] = useState<Family | null>(null);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await onLogin(code.trim());
      if (!result.success) {
        setError('Invalid access code. Please try again.');
      } else if (result.needsRegistration && result.family) {
        // Code is valid but unclaimed - go to registration step
        setPendingFamily(result.family);
        setStep('register');
      }
      // If success and no registration needed, App.tsx handles the redirect
    } catch (err) {
      setError('Connection error. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim() || !pendingFamily) return;

    setLoading(true);
    setError('');

    try {
      const success = await onClaimCode(pendingFamily.id, familyName.trim());
      if (!success) {
        setError('Failed to register. Please try again.');
      }
      // Success handled by App.tsx
    } catch (err) {
      setError('Connection error. Please try again.');
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
          
          {step === 'code' ? (
            // STEP 1: Enter Code
            <>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Family</h1>
                  <p className="text-slate-500">Enter your unique access code to allocate hours to student projects.</p>
                </div>

                <form onSubmit={handleCodeSubmit} className="space-y-4">
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
                        placeholder="e.g. ABC123"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 font-mono uppercase tracking-wide placeholder-slate-400 bg-slate-50 focus:bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
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
                        Continue <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  You should have received a code from the event organizers.
                </p>
              </div>
            </>
          ) : (
            // STEP 2: Register Family Name
            <>
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} className="text-emerald-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Code Verified!</h1>
                  <p className="text-slate-500">Now, let's set up your family profile.</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-6 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Your Code</span>
                  <span className="font-mono font-bold text-slate-900">{pendingFamily?.accessCode}</span>
                </div>

                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="familyName" className="block text-sm font-medium text-slate-700 mb-1.5">Family Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="familyName"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        placeholder="e.g. The Smith Family"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !familyName.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Start Allocating <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => { setStep('code'); setError(''); setPendingFamily(null); }}
                  className="text-xs text-slate-500 hover:text-slate-700 w-full text-center"
                >
                  ← Use a different code
                </button>
              </div>
            </>
          )}
        </div>
        
        <p className="text-center mt-8 text-sm text-slate-400">
          © 2025 Concept Market • Festival of Learning
        </p>

      </div>
    </div>
  );
};

export default Login;