
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

const renderFormattedText = (text: string): React.ReactNode[] => {
  if (!text) return [];

  const parseLine = (line: string, key: React.Key) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={key}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-cyan-300">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    );
  };
  
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  text.trim().split('\n').forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.endsWith(':') && trimmedLine.length < 80) { // Heading
      flushList();
      elements.push(
        <h4 key={`h4-${index}`} className="text-cyan-400 font-semibold text-lg mt-5 mb-3 border-b border-slate-700 pb-2">
          {parseLine(trimmedLine.slice(0, -1), index)}
        </h4>
      );
    } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) { // List item
      listItems.push(parseLine(trimmedLine.substring(2), index));
    } else { // Paragraph
      flushList();
      elements.push(
        <p key={`p-${index}`} className="my-3 leading-relaxed">
          {parseLine(trimmedLine, index)}
        </p>
      );
    }
  });

  flushList();
  return elements;
};

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ predictionText, sources }) => {
  const parsedPrediction = useMemo<ParsedPrediction>(() => {
    const sections: ParsedPrediction = { analysis: '' };
    const lines = predictionText.split('\n');
    let verdictSectionStarted = false;

    const keyMapping: { [key: string]: keyof ParsedPrediction } = {
        '🎯': 'bestBets', '🔥': 'confidenceScore', '📊': 'stakingPlan',
        '⚠️': 'redFlags', '🛡️': 'safetyNotes',
    };
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const icon = trimmedLine.substring(0, 2).trim();
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
        <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Intelligence Report</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {bestBets && <InfoCard title="Best Bet(s)" icon="🎯">{bestBets}</InfoCard>}
                {confidenceScore && <InfoCard title="Confidence" icon="🔥">{confidenceScore}</InfoCard>}
                {stakingPlan && <InfoCard title="Staking Plan" icon="📊">{stakingPlan}</InfoCard>}
                {redFlags && <InfoCard title="Red Flags" icon="⚠️">{redFlags}</InfoCard>}
            </div>
            
            <div className="space-y-6">
                {analysis.trim() && (
                    <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Full Analysis
                        </h3>
                        <div className="text-slate-300">
                            {renderFormattedText(analysis)}
                        </div>
                    </div>
                )}

                {safetyNotes && safetyNotes.toLowerCase() !== 'none' && (
                     <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                           <span className="text-2xl mr-3">🛡️</span> Safety Notes & Strategy
                        </h3>
                        <div className="whitespace-pre-wrap text-slate-300">
                            {safetyNotes}
                        </div>
                    </div>
                )}

                {sources.length > 0 && (
                     <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <h3 className="text-xl font-semibold text-white mb-4">Research Sources</h3>
                        <ul className="list-disc list-inside text-sm space-y-2">
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
