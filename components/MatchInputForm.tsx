import React from 'react';
import { MatchInput } from '../types';

interface MatchInputFormProps {
  matchInput: MatchInput;
  setMatchInput: React.Dispatch<React.SetStateAction<MatchInput>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const MatchInputForm: React.FC<MatchInputFormProps> = ({ matchInput, setMatchInput, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatchInput({ matchInfo: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-5 shadow-lg">
      <div>
        <label htmlFor="matchInfo" className="block text-sm font-medium text-slate-400 mb-1">Match Info</label>
        <input
          type="text"
          id="matchInfo"
          name="matchInfo"
          value={matchInput.matchInfo}
          onChange={handleChange}
          placeholder="e.g., Manchester City vs Arsenal, Premier League"
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
      >
        {isLoading ? 'Analyzing...' : 'Generate Prediction'}
      </button>
    </form>
  );
};

export default MatchInputForm;