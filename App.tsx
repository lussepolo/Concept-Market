
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, PieChart, LayoutGrid, TrendingUp, LogOut } from 'lucide-react';
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
  const remainingCoins = storage.calculateRemainingCoins(allocations);
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
      
      const matchesPortfolio = view === 'portfolio' ? allocations.some(a => a.projectId === p.id && a.coins > 0) : true;

      return matchesSearch && matchesDivision && matchesTheme && matchesPortfolio;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.investorCount - a.investorCount;
        case 'name': return a.title.localeCompare(b.title);
        case 'coins_high': return b.totalCoinsInvested - a.totalCoinsInvested;
        case 'coins_low': return a.totalCoinsInvested - b.totalCoinsInvested;
        default: return 0;
      }
    });
  }, [projects, searchQuery, selectedDivision, selectedTheme, sortBy, view, allocations]);

  // -- Handlers --

  const handleLogin = async (code: string) => {
    try {
      const user = await storage.login(code);
      if (user) {
        // We set the state manually here to allow immediate UI feedback, 
        // but the useEffect subscription will verify and keep it in sync.
        setCurrentUser(user);
        if (user.id === 'admin_user') {
          setView('admin');
        } else {
          setView('market');
        }
        // Force a re-mount of subscription if needed handled by dependency array
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

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === 'admin') {
    return <Admin onLogout={handleLogout} />;
  }

  // Navbar Component
  const Navbar = () => (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
              <span className="hidden sm:block text-xl font-bold tracking-tight text-slate-900">Concept Market</span>
            </div>
            <div className="hidden md:flex space-x-1">
              {[
                { id: 'market', label: 'Opportunities', icon: LayoutGrid },
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
               <span className={`text-sm font-bold ${remainingCoins < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                 {remainingCoins} / {storage.MAX_COINS} coins
               </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} alt="User" className="w-full h-full" />
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 p-2" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden border-t border-slate-100 flex justify-around p-2">
          <button onClick={() => setView('market')} className={`p-2 rounded-md ${view === 'market' ? 'bg-slate-100 text-emerald-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
          <button onClick={() => setView('portfolio')} className={`p-2 rounded-md ${view === 'portfolio' ? 'bg-slate-100 text-emerald-600' : 'text-slate-400'}`}><PieChart size={20}/></button>
          <button onClick={() => setView('leaderboard')} className={`p-2 rounded-md ${view === 'leaderboard' ? 'bg-slate-100 text-emerald-600' : 'text-slate-400'}`}><TrendingUp size={20}/></button>
      </div>
    </nav>
  );

  const Header = () => (
    <div className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
               {view === 'market' ? 'Investment Opportunities' : view === 'portfolio' ? 'My Portfolio' : 'Market Leaderboard'}
             </h1>
             <p className="mt-2 text-slate-500 max-w-2xl text-lg">
               {view === 'market' 
                 ? "Select Middle and High School projects to back with your family’s investment balance."
                 : view === 'portfolio'
                 ? "Manage your active investments. You can support up to 5 projects."
                 : "Real-time tracking of top funded student projects."
               }
             </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl min-w-[120px]">
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Projects Live</div>
              <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl min-w-[120px]">
              <div className="text-emerald-700 text-xs font-medium uppercase tracking-wider">Your Balance</div>
              <div className="text-2xl font-bold text-emerald-700">{remainingCoins}</div>
            </div>
          </div>
        </div>
        {view !== 'leaderboard' && (
          <div className="mt-8 flex flex-col lg:flex-row gap-4 items-center">
             <div className="relative w-full lg:w-96 group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               </div>
               <input
                 type="text"
                 placeholder="Search projects, teams..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-all shadow-sm"
               />
             </div>
             <div className="flex-1 w-full overflow-x-auto no-scrollbar flex gap-2 items-center">
               <Filter size={16} className="text-slate-400 flex-shrink-0 mr-1" />
               <select 
                  value={selectedDivision} 
                  onChange={(e) => setSelectedDivision(e.target.value as any)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
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
                 className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
               >
                 <option value="popular">Most Popular</option>
                 <option value="coins_high">Highest Funded</option>
                 <option value="coins_low">Needs Funding</option>
                 <option value="name">Name (A-Z)</option>
               </select>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const LeaderboardView = () => {
    const topProjects = [...projects].sort((a, b) => b.totalCoinsInvested - a.totalCoinsInvested).slice(0, 20);
    const maxCoins = Math.max(...topProjects.map(p => p.totalCoinsInvested), 1);
    return (
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <TrendingUp size={18} className="text-emerald-500"/> Top Funded Projects
           </h3>
           <span className="text-xs text-slate-500">Updated Live</span>
        </div>
        <div className="divide-y divide-slate-100">
          {topProjects.map((project, index) => (
            <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
               <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                 {index + 1}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-900 truncate">{project.title}</span>
                    <span className="font-bold text-emerald-600">{project.totalCoinsInvested}</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${(project.totalCoinsInvested / maxCoins) * 100}%`}}
                    />
                 </div>
                 <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{project.theme}</span>
                    <span>{project.investorCount} investors</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <Header />
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
                    const allocation = allocations.find(a => a.projectId === project.id)?.coins || 0;
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
          currentAllocation={allocations.find(a => a.projectId === selectedProject.id)?.coins || 0}
          remainingBudget={remainingCoins}
          onConfirm={handleAllocationConfirm}
        />
      )}
    </div>
  );
}
