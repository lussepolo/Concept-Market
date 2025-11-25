import React from 'react';
import { Project } from '../types';
import { TrendingUp, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  allocation: number;
  onAdjust: (project: Project) => void;
  canInvest: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, allocation, onAdjust, canInvest }) => {
  const isInvested = allocation > 0;

  return (
    <div className={`group relative flex flex-col bg-white rounded-xl border transition-all duration-200 ${isInvested ? 'border-emerald-200 shadow-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
      
      {/* Image Section */}
      <div className="h-40 w-full overflow-hidden rounded-t-xl relative bg-slate-100">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
           <span className={`px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md ${project.division === 'High School' ? 'bg-indigo-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
             {project.division === 'Middle School' ? 'MS' : 'HS'}
           </span>
        </div>
        {isInvested && (
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/90 backdrop-blur-sm py-1 px-3 flex justify-between items-center">
             <span className="text-xs font-bold text-white uppercase tracking-wider">In Portfolio</span>
             <span className="text-xs font-bold text-white">{allocation} coins</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
          <span className="text-emerald-600">{project.theme}</span>
          <span>•</span>
          <span>{project.primaryArea}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
          {project.mdp}
        </p>

        <div className="space-y-3">
          {/* Team */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users size={14} />
            <span className="truncate">{project.team.join(", ")}</span>
          </div>

          {/* Live Stats */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
             <div className="flex flex-col">
               <span className="text-slate-400 text-xs font-medium">Total Raised</span>
               <span className="font-semibold text-slate-700 flex items-center gap-1">
                 {project.totalCoinsInvested} <TrendingUp size={12} className="text-emerald-500"/>
               </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-slate-400 text-xs font-medium">Backers</span>
                <span className="font-semibold text-slate-700">{project.investorCount}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="p-4 pt-0">
        <button 
          onClick={() => onAdjust(project)}
          disabled={!isInvested && !canInvest}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 
            ${isInvested 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          {isInvested ? 'Adjust Allocation' : canInvest ? 'Invest Coins' : 'Portfolio Full'}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
