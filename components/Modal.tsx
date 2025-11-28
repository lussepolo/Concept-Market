import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, AlertCircle } from 'lucide-react';
import { Project, Allocation } from '../types';
import { MAX_HOURS } from '../services/storage';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentAllocation: number;
  remainingBudget: number;
  onConfirm: (amount: number) => void;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  project, 
  currentAllocation, 
  remainingBudget, 
  onConfirm 
}) => {
  const [amount, setAmount] = useState(currentAllocation);
  
  // Reset internal state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(currentAllocation);
    }
  }, [isOpen, currentAllocation]);

  if (!isOpen) return null;

  // Calculate max possible addition based on budget
  // The user can go up to (Remaining + CurrentAmount)
  // But never more than 100 total (which is handled by remaining)
  // And technically a single project could take all 100.
  const maxAssignable = remainingBudget + currentAllocation;

  const handleIncrement = () => {
    if (amount < maxAssignable) {
      setAmount(prev => prev + 2); // Increment by 2
    }
  };

  const handleDecrement = () => {
    if (amount >= 2) {
      setAmount(prev => prev - 2);
    } else {
      setAmount(0);
    }
  };

  const handleSave = () => {
    onConfirm(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-900">Adjust Allocation</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="flex items-start space-x-4">
            <img src={project.imageUrl} alt={project.title} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
            <div>
              <h4 className="font-semibold text-slate-900 leading-tight">{project.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{project.division} • {project.theme}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500">Allocated Hours</span>
              <span className="text-2xl font-bold text-slate-900">{amount} <span className="text-sm text-slate-400 font-normal">hours</span></span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={handleDecrement}
                disabled={amount === 0}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-concept-500 hover:text-concept-600 disabled:opacity-50 disabled:hover:border-slate-200 transition-all"
              >
                <Minus size={20} />
              </button>
              
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                 {/* Visual representation of 100 coins max */}
                <div 
                  className="h-full bg-concept-500 transition-all duration-300 ease-out"
                  style={{ width: `${amount}%` }}
                />
              </div>

              <button 
                onClick={handleIncrement}
                disabled={amount >= maxAssignable}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-concept-500 hover:text-concept-600 disabled:opacity-50 disabled:hover:border-slate-200 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-concept-50 text-concept-800 text-sm rounded-lg">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              You have <strong>{remainingBudget - (amount - currentAllocation)}</strong> hours remaining after this transaction.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-concept-500 text-white font-medium rounded-lg shadow-sm hover:bg-concept-600 active:scale-95 transition-all"
          >
            Confirm Allocation
          </button>
        </div>

      </div>
    </div>
  );
};

export default Modal;
