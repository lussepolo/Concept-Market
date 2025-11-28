
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, PieChart, LayoutGrid, TrendingUp, LogOut, User } from 'lucide-react';
import { Project, Division, SortOption, Family } from './types';
import * as storage from './services/storage';
import Modal from './components/Modal';
import ProjectCard from './components/ProjectCard';
import Login from './components/Login';
import Admin from './components/Admin';

// Views
type View = 'market' | 'portfolio' | 'leaderboard' | 'admin';

export default function App() {
  // -- Auth State --
  const [currentUser, setCurrentUser] = useState<Family | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // -- App State --
  const [view, setView] = useState<View>('market');
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<Division | 'All'>('All');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // -- Initialization & Subscriptions --
  
  // 1. Check Session on Mount
  useEffect(() => {
    const sessionId = storage.getSessionId();
    if (sessionId) {
      const unsub = storage.subscribeToFamily(sessionId, (user) => {
        setCurrentUser(user);
        if (user) {
          if (user.id === 'admin_user') setView('admin');
        } else {
          // Session invalid (user deleted remotely?)
          storage.logout();
        }
        setAuthLoading(false);
      });
      return () => unsub();
    } else {
      setAuthLoading(false);
    }
  }, []);

  // 2. Subscribe to Projects (Global Data)
  useEffect(() => {
    if (!currentUser) return; // Don't fetch if not logged in
    
    const unsub = storage.subscribeToProjects((data) => {
      setProjects(data);
    });
    return () => unsub();
  }, [currentUser]); // Re-subscribe if login state changes (though mostly just needs to happen once authorized)


  // -- Computed --
  const allocations = currentUser?.allocations || [];
  const remainingHours = storage.calculateRemainingHours(allocations);
  const investedProjectCount = allocations.length;
  const canInvestInNew = investedProjectCount < storage.MAX_PROJECTS;

  const uniqueThemes = useMemo(() => {
    const themes = new Set(projects.map(p => p.theme));
    return ['All', ...Array.from(themes)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.team.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDivision = selectedDivision === 'All' || p.division === selectedDivision;
      const matchesTheme = selectedTheme === 'All' || p.theme === selectedTheme;
      
      const matchesPortfolio = view === 'portfolio' ? allocations.some(a => a.projectId === p.id && a.hours > 0) : true;

      return matchesSearch && matchesDivision && matchesTheme && matchesPortfolio;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.investorCount - a.investorCount;
        case 'name': return a.title.localeCompare(b.title);
        case 'hours_high': return b.totalHoursInvested - a.totalHoursInvested;
        case 'hours_low': return a.totalHoursInvested - b.totalHoursInvested;
        default: return 0;
      }
    });
  }, [projects, searchQuery, selectedDivision, selectedTheme, sortBy, view, allocations]);

  // -- Handlers --

  const handleLogin = async (code: string): Promise<{ success: boolean; needsRegistration?: boolean; family?: Family }> => {
    try {
      const user = await storage.login(code);
      if (user) {
        // Check if this is an unclaimed code (empty studentName)
        if (!user.studentName && user.id !== 'admin_user') {
          // Don't set as current user yet - needs registration
          return { success: true, needsRegistration: true, family: user };
        }
        
        // Already registered - proceed with login
        setCurrentUser(user);
        if (user.id === 'admin_user') {
          setView('admin');
        } else {
          setView('market');
        }
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  };

  const handleClaimCode = async (familyId: string, studentName: string): Promise<boolean> => {
    try {
      const user = await storage.claimCode(familyId, studentName);
      if (user) {
        // Save session and set user
        localStorage.setItem('concept_market_session_user', familyId);
        setCurrentUser(user);
        setView('market');
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setView('market');
    // Reload to clear any memory states/subscriptions cleanly
    window.location.reload();
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleAllocationConfirm = async (amount: number) => {
    if (!selectedProject || !currentUser) return;
    
    // Optimistic UI update could go here, but since we are local/firebase fast, we rely on subscription
    await storage.updateFamilyAllocations(
      currentUser.id,
      selectedProject.id,
      amount
    );
    // No need to setProjects or setCurrentUser manually, the listeners in useEffect will trigger.
  };

  // -- Render --

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-concept-500 border-t-transparent rounded-full animate-spin" /></div>;
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} onClaimCode={handleClaimCode} />;
  }

  if (view === 'admin') {
    return <Admin onLogout={handleLogout} />;
  }

  // Navbar JSX (inline to avoid focus loss on re-render)
  const navbarContent = (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/ConceptLogo.png" alt="Escola Concept" className="h-12 w-auto" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-7 w-px bg-slate-300" />
                <span className="text-base font-bold tracking-tight text-slate-900">Concept Market</span>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {[
                { id: 'market', label: 'Projects', icon: LayoutGrid },
                { id: 'portfolio', label: 'My Portfolio', icon: PieChart },
                { id: 'leaderboard', label: 'Live Leaderboard', icon: TrendingUp }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as View)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={16} className="mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-xs font-medium text-slate-500">{currentUser.studentName}</span>
               <span className={`text-sm font-bold ${remainingHours < 0 ? 'text-red-500' : 'text-concept-600'}`}>
                 {remainingHours} / {storage.MAX_HOURS} hours
               </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
               <User size={20} className="text-slate-500" />
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 p-2" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden border-t border-slate-100 flex justify-around p-2">
          <button onClick={() => setView('market')} className={`p-2 rounded-md ${view === 'market' ? 'bg-slate-100 text-concept-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
          <button onClick={() => setView('portfolio')} className={`p-2 rounded-md ${view === 'portfolio' ? 'bg-slate-100 text-concept-600' : 'text-slate-400'}`}><PieChart size={20}/></button>
          <button onClick={() => setView('leaderboard')} className={`p-2 rounded-md ${view === 'leaderboard' ? 'bg-slate-100 text-concept-600' : 'text-slate-400'}`}><TrendingUp size={20}/></button>
      </div>
    </nav>
  );

  const headerContent = (
    <div className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
               {view === 'market' ? 'Projects' : view === 'portfolio' ? 'My Portfolio' : 'Leaderboard'}
             </h1>
             <p className="mt-2 text-slate-500 max-w-2xl text-lg">
               {view === 'market' 
                 ? "Allocate your family's hours to Middle and High School projects."
                 : view === 'portfolio'
                 ? "Manage your allocated hours. You can support up to 5 projects."
                 : "Real-time tracking of projects with the most hours allocated."
               }
             </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl min-w-[120px]">
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Projects Live</div>
              <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
            </div>
            <div className="bg-concept-50 border border-concept-100 px-4 py-3 rounded-xl min-w-[120px]">
              <div className="text-concept-700 text-xs font-medium uppercase tracking-wider">Your Hours</div>
              <div className="text-2xl font-bold text-concept-700">{remainingHours}</div>
            </div>
          </div>
        </div>
        {view !== 'leaderboard' && (
          <div className="mt-8 flex flex-col lg:flex-row gap-4 items-center">
             <div className="relative w-full lg:w-96 group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search size={18} className="text-slate-400 group-focus-within:text-concept-500 transition-colors" />
               </div>
               <input
                 type="text"
                 placeholder="Search projects, teams..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-concept-500 focus:ring-1 focus:ring-concept-500 sm:text-sm transition-all shadow-sm"
               />
             </div>
             <div className="flex-1 w-full overflow-x-auto no-scrollbar flex gap-2 items-center">
               <Filter size={16} className="text-slate-400 flex-shrink-0 mr-1" />
               <select 
                  value={selectedDivision} 
                  onChange={(e) => setSelectedDivision(e.target.value as any)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-concept-500 focus:border-concept-500 block p-2.5"
               >
                 <option value="All">All Divisions</option>
                 <option value={Division.MIDDLE_SCHOOL}>Middle School</option>
                 <option value={Division.HIGH_SCHOOL}>High School</option>
               </select>
               {uniqueThemes.slice(0, 4).map(theme => (
                 <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedTheme === theme ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                 >
                   {theme}
                 </button>
               ))}
             </div>
             <div className="flex-shrink-0 w-full lg:w-auto">
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as SortOption)}
                 className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-concept-500 focus:border-concept-500 block p-2.5"
               >
                 <option value="popular">Most Popular</option>
                 <option value="hours_high">Most Hours</option>
                 <option value="hours_low">Needs Hours</option>
                 <option value="name">Name (A-Z)</option>
               </select>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const LeaderboardView = () => {
    const topProjects = [...projects].sort((a, b) => b.totalHoursInvested - a.totalHoursInvested).slice(0, 20);
    const maxHours = Math.max(...topProjects.map(p => p.totalHoursInvested), 1);
    const top3 = topProjects.slice(0, 3);
    const rest = topProjects.slice(3);
    
    const getMedalStyle = (index: number) => {
      if (index === 0) return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-lg shadow-yellow-500/30';
      if (index === 1) return 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700 shadow-lg shadow-slate-400/30';
      if (index === 2) return 'bg-gradient-to-br from-amber-500 to-amber-700 text-amber-100 shadow-lg shadow-amber-500/30';
      return 'bg-slate-100 text-slate-500';
    };

    const getBarColor = (index: number) => {
      if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      if (index === 1) return 'bg-gradient-to-r from-slate-400 to-slate-500';
      if (index === 2) return 'bg-gradient-to-r from-amber-500 to-amber-600';
      return 'bg-concept-500';
    };

    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-concept-500 to-concept-600 rounded-2xl p-6 text-white shadow-xl shadow-concept-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp size={22} />
                </div>
                <h2 className="text-2xl font-bold">Live Leaderboard</h2>
              </div>
              <p className="text-concept-100">Real-time ranking of projects by hours invested</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
                <span className="w-2 h-2 bg-concept-200 rounded-full animate-pulse" />
                Updating Live
              </div>
              <p className="text-concept-100 text-sm mt-2">{projects.length} projects competing</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center transform hover:scale-[1.02] transition-transform">
              <div className={`w-14 h-14 ${getMedalStyle(1)} rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">{top3[1]?.title}</h3>
              <div className="text-2xl font-bold text-slate-700">{top3[1]?.totalHoursInvested}</div>
              <div className="text-xs text-slate-500">hours</div>
              <div className="mt-3 flex justify-center gap-1">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{top3[1]?.theme}</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200 p-5 text-center transform hover:scale-[1.02] transition-transform -mt-4 shadow-lg">
              <div className="text-3xl mb-1">👑</div>
              <div className={`w-16 h-16 ${getMedalStyle(0)} rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-3`}>
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-2">{top3[0]?.title}</h3>
              <div className="text-3xl font-bold text-yellow-600">{top3[0]?.totalHoursInvested}</div>
              <div className="text-xs text-yellow-700">hours invested</div>
              <div className="mt-3 flex justify-center gap-1">
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">{top3[0]?.investorCount} supporters</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center transform hover:scale-[1.02] transition-transform">
              <div className={`w-14 h-14 ${getMedalStyle(2)} rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">{top3[2]?.title}</h3>
              <div className="text-2xl font-bold text-amber-700">{top3[2]?.totalHoursInvested}</div>
              <div className="text-xs text-slate-500">hours</div>
              <div className="mt-3 flex justify-center gap-1">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{top3[2]?.theme}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rest of Rankings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Rankings #4 - #{topProjects.length}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {rest.map((project, i) => {
              const index = i + 3;
              return (
                <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-slate-200 transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 block truncate">{project.title}</span>
                        <span className="text-xs text-slate-500">{project.team.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="font-bold text-concept-600 text-lg">{project.totalHoursInvested}</span>
                        <span className="text-xs text-slate-400 block">hours</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${getBarColor(index)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(project.totalHoursInvested / maxHours) * 100}%`}}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{project.theme}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{project.investorCount} supporters</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {navbarContent}
      {headerContent}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'leaderboard' ? (
          <LeaderboardView />
        ) : (
          <>
             {filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(project => {
                    const allocation = allocations.find(a => a.projectId === project.id)?.hours || 0;
                    return (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        allocation={allocation}
                        onAdjust={handleOpenModal}
                        canInvest={canInvestInNew}
                      />
                    );
                  })}
               </div>
             )}
          </>
        )}
      </main>
      {selectedProject && (
        <Modal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          project={selectedProject}
          currentAllocation={allocations.find(a => a.projectId === selectedProject.id)?.hours || 0}
          remainingBudget={remainingHours}
          onConfirm={handleAllocationConfirm}
        />
      )}
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Built with 💙 by <span className="font-semibold text-slate-700">Pedro Quartiero</span> • Grade 12 Legacy Project
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Festival of Learning 2025 • Escola Concept
          </p>
        </div>
      </footer>
    </div>
  );
}
