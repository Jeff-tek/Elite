
import React, { useState, useCallback } from 'react';
import { MatchInput, WebSource } from './types';
import { getPrediction } from './services/geminiService';
import Header from './components/Header';
import MatchInputForm from './components/MatchInputForm';
import PredictionDisplay from './components/PredictionDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';

function App(): React.ReactNode {
  const [matchInput, setMatchInput] = useState<MatchInput>({
    matchInfo: '',
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = useCallback(async () => {
    if (!matchInput.matchInfo.trim()) {
      setError('Please enter match information.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setWebSources([]);

    try {
      const result = await getPrediction(matchInput);
      setPrediction(result.text);
      if(result.sources) {
        setWebSources(result.sources);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [matchInput]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">AI-Powered Match Analysis</h2>
            <p className="text-slate-400 text-lg">
              Enter matchup details to receive an elite tactical and statistical breakdown.
            </p>
          </div>

          <MatchInputForm
            matchInput={matchInput}
            setMatchInput={setMatchInput}
            onSubmit={handlePrediction}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Loader />}

          {prediction && (
            <PredictionDisplay predictionText={prediction} sources={webSources} />
          )}

           {!isLoading && !prediction && !error && (
            <div className="text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-slate-400">Your expert analysis will appear here.</p>
            </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
