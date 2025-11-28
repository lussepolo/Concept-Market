
import React, { useState } from 'react';
import { ArrowRight, Lock, CheckCircle, RefreshCw, Search, TrendingUp } from 'lucide-react';
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
              <div className="absolute top-0 left-0 w-32 h-32 bg-concept-500/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full translate-y-1/2 translate-x-1/2" />
              
              <div className="relative flex flex-col justify-center h-full min-h-[450px]">
                {step === 'code' ? (
                  // STEP 1: Enter Code
                  <>
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center text-center mb-10">
                      <img src="/ConceptLogo.png" alt="Escola Concept" className="h-36 w-auto mb-2" />
                      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Concept Market</h1>
                      <p className="text-slate-500 mt-1">Investor Portal</p>
                    </div>

                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2 text-center">Access Code</label>
                        <input
                          type="text"
                          id="accessCode"
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="ABC123"
                          className="block w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-concept-500 focus:border-concept-500 transition-all text-slate-900 font-mono uppercase tracking-widest placeholder-slate-300 bg-white text-xl text-center"
                          autoFocus
                        />
                      </div>

                      {error && (
                        <p className="text-center text-sm text-red-500">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading || !code}
                        className="w-full flex items-center justify-center gap-2 bg-concept-500 hover:bg-concept-600 text-white font-semibold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-concept-500/30 text-lg"
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
                    
                    <p className="text-center text-xs text-slate-400 mt-8">
                      Festival of Learning 2025
                    </p>
                  </>
                ) : (
                  // STEP 2: Register Family Name
                  <>
                    {/* Success Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className="w-16 h-16 bg-concept-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-concept-500/30">
                        <CheckCircle size={32} className="text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900">Code Verified!</h1>
                      <p className="text-slate-500 mt-1">One more step to get started</p>
                    </div>

                    <div className="bg-concept-50 rounded-xl p-3 mb-6 flex items-center justify-center gap-2">
                      <Lock size={14} className="text-concept-600" />
                      <span className="font-mono font-bold text-concept-700 tracking-wider">{pendingFamily?.accessCode}</span>
                    </div>

                    <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2 text-center">Family Name</label>
                        <input
                          type="text"
                          id="familyName"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          placeholder="e.g. The Smith Family"
                          className="block w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-concept-500 focus:border-concept-500 transition-all text-slate-900 placeholder-slate-300 bg-white text-lg text-center"
                          autoFocus
                        />
                      </div>

                      {error && (
                        <p className="text-center text-sm text-red-500">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading || !familyName.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-concept-500 hover:bg-concept-600 text-white font-semibold py-4 px-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-concept-500/30 text-lg"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Start Investing <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <button 
                      onClick={() => { setStep('code'); setError(''); setPendingFamily(null); }}
                      className="text-sm text-slate-400 hover:text-concept-600 w-full text-center mt-6 transition-colors"
                    >
                      ← Use different code
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Instructions Panel */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-gradient-to-br from-concept-50 to-concept-50 rounded-2xl shadow-xl border border-concept-200 p-8 h-full overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-concept-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-concept-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-concept-500/10 text-concept-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <span className="w-2 h-2 bg-concept-500 rounded-full animate-pulse" />
                  Passion Project
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Angel Investment Opportunity</h2>
                <p className="text-slate-600 mb-6">
                  During the Festival of Learning, learners present projects reflecting research, prototyping, and impact. As families, you are invited to engage with this work not just as observers, but as <span className="font-semibold text-slate-800">evaluators</span>.
                </p>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-concept-500 rounded-xl flex items-center justify-center shadow-lg shadow-concept-500/30">
                      <RefreshCw size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Step 1: Be an Angel Investor</h3>
                      <p className="text-slate-600 text-sm">
                        Upon arrival, use your unique access code to enter the Concept Market. You are managing a real investment fund.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-concept-500 rounded-xl flex items-center justify-center shadow-lg shadow-concept-500/30">
                      <Search size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Step 2: Understand the Value</h3>
                      <p className="text-slate-600 text-sm">
                        Your family receives <span className="font-bold text-concept-600 bg-concept-100 px-1.5 py-0.5 rounded">24 Concept Hours</span>. Each hour represents one hour of your time you are willing to invest in supporting a project.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-concept-500 rounded-xl flex items-center justify-center shadow-lg shadow-concept-500/30">
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Step 3: Invest Strategically</h3>
                      <p className="text-slate-600 text-sm">
                        You may invest in up to <span className="font-bold">5 projects</span>. This encourages thoughtful assessment and selective decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Ideated by <span className="font-semibold text-slate-700">Escola Concept</span> • Developed by <span className="font-semibold text-slate-700">Pedro Quartiero</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Grade 12 Legacy Project • Festival of Learning 2025
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;