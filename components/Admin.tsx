
import React, { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, Key, ShieldAlert, LogOut, Download, Database } from 'lucide-react';
import { Family } from '../types';
import * as storage from '../services/storage';
import { isConfigured } from '../services/config';

interface AdminProps {
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const isLive = isConfigured();
  
  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    setLoading(true);
    const data = await storage.getAllFamilies();
    setFamilies(data);
    setLoading(false);
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;
    setLoading(true);
    await storage.createFamily(newFamilyName.trim());
    setNewFamilyName('');
    await loadFamilies();
    setLoading(false);
  };

  const handleReset = async () => {
    if (confirm('Are you sure? This will delete/reset all data. This cannot be undone.')) {
      setLoading(true);
      await storage.resetSystem();
      await loadFamilies();
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (confirm('This will upload 72 projects and initial families to the database. Continue?')) {
      setLoading(true);
      await storage.seedDatabase();
      await loadFamilies();
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalFamilies = families.length;
    const activeFamilies = families.filter(f => f.allocations.length > 0).length;
    const totalAllocated = families.reduce((sum, f) => sum + f.allocations.reduce((s, a) => s + a.coins, 0), 0);
    return { totalFamilies, activeFamilies, totalAllocated };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold">System Administration</h1>
              <p className="text-slate-400 text-sm">Concept Market • Festival of Learning</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Exit Admin
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Environment Status Banner */}
        {isLive ? (
           <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
             <Database className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
             <div>
               <h3 className="font-bold text-emerald-900 text-sm">Live Cloud Mode (Firebase)</h3>
               <p className="text-emerald-700 text-sm mt-1">
                 You are connected to the global database. Changes here affect all users immediately.
               </p>
             </div>
           </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Local Storage Mode</h3>
              <p className="text-amber-700 text-sm mt-1">
                The system is currently running in local demo mode. Data is stored in this browser only. 
                Configure <code>services/config.ts</code> with Firebase keys to go live.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Families</div>
            <div className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.totalFamilies}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Families Voted</div>
            <div className="text-3xl font-bold text-emerald-600">{loading ? '...' : stats.activeFamilies}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Coins Invested</div>
            <div className="text-3xl font-bold text-indigo-600">{loading ? '...' : stats.totalAllocated}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Family Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users size={18} /> Registered Families
                </h2>
                <div className="flex gap-2">
                  <button onClick={loadFamilies} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
                  </button>
                  <span className="text-xs font-medium text-slate-500 px-2 py-2 bg-slate-200 rounded-lg">
                    {families.length} records
                  </span>
                </div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Family Name</th>
                      <th className="px-6 py-3">Access Code</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {families.map((family) => {
                      const totalInvested = (family.allocations || []).reduce((a, b) => a + b.coins, 0);
                      return (
                        <tr key={family.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{family.studentName}</td>
                          <td className="px-6 py-4">
                            <code className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 font-mono font-bold select-all">
                              {family.accessCode}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            {totalInvested > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-600">
                            {totalInvested} / 100
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            
            {/* Create New */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-emerald-500" /> Generate Login
              </h3>
              <form onSubmit={handleCreateFamily} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Family Name / ID</label>
                  <input 
                    type="text" 
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="e.g. The Anderson Family"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newFamilyName.trim() || loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Create & Generate Code'}
                </button>
              </form>
            </div>

            {/* System Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Key size={18} className="text-slate-400" /> Data Controls
              </h3>
              <div className="space-y-3">
                 <button 
                   onClick={handleSeed}
                   disabled={loading}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-sm transition-colors border border-indigo-100"
                 >
                   <Database size={16} /> Seed Database
                 </button>
                 <p className="text-xs text-slate-400 text-center px-2 mb-2">
                   Resets projects and adds default families.
                 </p>
                 <hr className="border-slate-100 my-2" />
                 <button 
                   onClick={() => window.print()}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors"
                 >
                   <Download size={16} /> Print/Export Codes
                 </button>
                 <button 
                   onClick={handleReset}
                   disabled={loading}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-sm transition-colors border border-red-100"
                 >
                   <RefreshCw size={16} /> Full System Reset
                 </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;