
import React, { useMemo } from 'react';
import { WebSource } from '../types';

interface PredictionDisplayProps {
  predictionText: string;
  sources: WebSource[];
}

interface ParsedPrediction {
  analysis: string;
  bestBets?: string;
  confidenceScore?: string;
  stakingPlan?: string;
  redFlags?: string;
  safetyNotes?: string;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode, icon: string }> = ({ title, children, icon }) => (
    <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center">
            <span className="mr-2 text-lg">{icon}</span>
            {title}
        </h3>
        <div className="text-cyan-300 font-medium text-lg">{children}</div>
    </div>
);

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ predictionText, sources }) => {
  const parsedPrediction = useMemo<ParsedPrediction>(() => {
    const sections: ParsedPrediction = { analysis: '' };
    const lines = predictionText.split('\n');
    let currentKey: keyof ParsedPrediction = 'analysis';

    const keyMapping: { [key: string]: keyof ParsedPrediction } = {
        '🎯': 'bestBets',
        '🔥': 'confidenceScore',
        '📊': 'stakingPlan',
        '⚠️': 'redFlags',
        '🛡️': 'safetyNotes',
    };
    
    let verdictSectionStarted = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const icon = trimmedLine.substring(0, 2);
        const key = Object.keys(keyMapping).find(k => icon.startsWith(k));
        
        if (key) {
            verdictSectionStarted = true;
            const newKey = keyMapping[key];
            const content = trimmedLine.replace(/🎯\s*Best Bet\(s\):|🔥\s*Confidence Score:|📊\s*Staking Plan:|⚠️\s*Red Flags Triggered:|🛡️\s*Safety Notes or Live Strategy:/i, '').trim();
            sections[newKey] = content;
        } else if (!verdictSectionStarted) {
            sections.analysis += `${line}\n`;
        }
    }

    return sections;
  }, [predictionText]);

  const { analysis, bestBets, confidenceScore, stakingPlan, redFlags, safetyNotes } = parsedPrediction;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg animate-fade-in">
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Intelligence Report</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {bestBets && <InfoCard title="Best Bet(s)" icon="🎯">{bestBets}</InfoCard>}
                {confidenceScore && <InfoCard title="Confidence" icon="🔥">{confidenceScore}</InfoCard>}
                {stakingPlan && <InfoCard title="Staking Plan" icon="📊">{stakingPlan}</InfoCard>}
                {redFlags && <InfoCard title="Red Flags" icon="⚠️">{redFlags}</InfoCard>}
            </div>
            
            <div className="space-y-6">
                {analysis && (
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-400 border-b-2 border-slate-700 pb-2 mb-3">Full Analysis</h3>
                        <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-wrap">
                            {analysis.trim()}
                        </div>
                    </div>
                )}

                {safetyNotes && safetyNotes.toLowerCase() !== 'none' && (
                     <div>
                        <h3 className="text-lg font-semibold text-cyan-400 border-b-2 border-slate-700 pb-2 mb-3">🛡️ Safety Notes & Strategy</h3>
                        <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-wrap">
                            {safetyNotes}
                        </div>
                    </div>
                )}

                {sources.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold text-cyan-400 border-b-2 border-slate-700 pb-2 mb-3">Research Sources</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {sources.map((source, index) => (
                                <li key={index}>
                                    <a 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default PredictionDisplay;
