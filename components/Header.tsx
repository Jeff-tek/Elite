
import React from 'react';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Elite Sports Intelligence
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
