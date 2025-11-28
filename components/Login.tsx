
import React, { useState } from 'react';
import { ArrowRight, Lock, AlertCircle, User, CheckCircle, RefreshCw, Search, TrendingUp } from 'lucide-react';
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
      <div className="w-full max-w-5xl">
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Side - Login Card */}
          <div className="w-full lg:w-1/2">
            {/* Card */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200 p-8 h-full overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                {/* Brand */}
                <div className="flex items-center gap-4 mb-8">
                  <img src="/ConceptLogo.png" alt="Escola Concept" className="h-20 w-auto" />
                  <div className="h-10 w-px bg-slate-300" />
                  <span className="text-lg font-bold tracking-tight text-slate-900">Concept Market</span>
                </div>
              
                {step === 'code' ? (
                  // STEP 1: Enter Code
                  <>
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">Investor Portal</h1>
                      <p className="text-slate-600 text-lg">Enter your family access code to access your capital fund.</p>
                    </div>

                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
                        <label htmlFor="accessCode" className="block text-sm font-medium text-slate-700 mb-2">Access Code</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-slate-400" />
                          </div>
                          <input
                            type="text"
                            id="accessCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="E.G. CMC2025"
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 font-mono uppercase tracking-wide placeholder-slate-400 bg-white focus:bg-white"
                            autoFocus
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                          <AlertCircle size={16} className="flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || !code}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 text-lg"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Access Market <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200/50 text-center">
                      <p className="text-sm text-slate-500">
                        Authorized access only • Festival of Learning 2025
                      </p>
                    </div>
                  </>
                ) : (
                  // STEP 2: Register Family Name
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                        <CheckCircle size={32} className="text-white" />
                      </div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">Code Verified!</h1>
                      <p className="text-slate-600 text-lg">Now, let's set up your family profile.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center justify-between border border-white shadow-sm">
                      <span className="text-sm text-slate-500">Your Code</span>
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">{pendingFamily?.accessCode}</span>
                    </div>

                    <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
                        <label htmlFor="familyName" className="block text-sm font-medium text-slate-700 mb-2">Family Name</label>
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
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 placeholder-slate-400 bg-white focus:bg-white"
                            autoFocus
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                          <AlertCircle size={16} className="flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || !familyName.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 text-lg"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Start Allocating <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200/50">
                      <button 
                        onClick={() => { setStep('code'); setError(''); setPendingFamily(null); }}
                        className="text-sm text-slate-500 hover:text-emerald-600 w-full text-center transition-colors"
                      >
                        ← Use a different code
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Instructions Panel */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-xl border border-emerald-200 p-8 h-full overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Festival of Learning 2025
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Become an Angel Investor</h2>
                <p className="text-slate-600 mb-8 text-lg">
                  Your family plays a crucial role in validating student innovation. Here is how it works:
                </p>

                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <RefreshCw size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">1. Activate your Fund</h3>
                      <p className="text-slate-600 text-sm">
                        Use the code provided on your access card. Your family wallet is pre-loaded with <span className="font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">24 Hours</span>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Search size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">2. Scout the Projects</h3>
                      <p className="text-slate-600 text-sm">
                        Explore the <span className="font-bold">72 student projects</span>. Talk to the teams, ask about their MDP, and assess their potential.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">3. Allocate Capital</h3>
                      <p className="text-slate-600 text-sm">
                        Invest your hours in up to <span className="font-bold">5 projects</span>. Your "investment" is real-time feedback that helps students understand the market value of their ideas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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