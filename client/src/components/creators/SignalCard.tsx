import React from 'react';
import { Shield, Target, Info, MessageSquare } from 'lucide-react';
import ExplanatoryBadge from '../common/ExplanatoryBadge';

interface AffiliationEntity {
  name: string;
  sentiment: string;
  strength: string;
}

interface CredibilityClaim {
  text: string;
  verifiable: boolean;
  hasEvidence: boolean;
}

interface SignalProps {
  signal: {
    type: 'affiliation' | 'credibility' | 'incentive';
    data: any;
    reasoning: string;
    createdAt: string;
  };
}

const SignalCard: React.FC<SignalProps> = ({ signal }) => {
  const isAffiliation = signal.type === 'affiliation';
  const isCredibility = signal.type === 'credibility';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isAffiliation ? (
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            ) : (
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            <div>
              <h4 className="text-white font-semibold">
                {isAffiliation ? 'Affiliation Signal' : 'Credibility Analysis'}
              </h4>
              <p className="text-xs text-zinc-500">
                AI analyzed {new Date(signal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ExplanatoryBadge 
            label={signal.type} 
            type={isAffiliation ? 'info' : 'success'} 
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isAffiliation && signal.data && Array.isArray(signal.data.entities) && (
            <div className="flex flex-wrap gap-2">
              {signal.data.entities.map((entity: AffiliationEntity, idx: number) => (
                <div 
                  key={idx}
                  className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg flex items-center gap-2"
                >
                  <span className="text-sm text-zinc-200 font-medium">{entity.name}</span>
                  <span className={`text-xs ${entity.sentiment.includes('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {entity.sentiment}
                  </span>
                  <span className="text-[10px] text-zinc-500 px-1 border border-zinc-700 rounded">
                    S:{entity.strength}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isCredibility && signal.data && Array.isArray(signal.data.claims) && (
            <div className="space-y-2">
              {signal.data.claims.map((claim: CredibilityClaim, idx: number) => (
                <div 
                  key={idx}
                  className="p-3 bg-zinc-800/30 border border-zinc-800 rounded-lg flex items-start gap-3"
                >
                  <Info className={`h-4 w-4 mt-0.5 ${claim.verifiable ? 'text-blue-500' : 'text-zinc-500'}`} />
                  <div>
                    <p className="text-sm text-zinc-300 leading-relaxed italic">"{claim.text}"</p>
                    <div className="flex gap-2 mt-2">
                      {claim.verifiable && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                          Verifiable
                        </span>
                      )}
                      {claim.hasEvidence && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                          Evidence Provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {signal.data?.summary && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {signal.data.summary}
              </p>
            </div>
          )}

          {/* Reasoning */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-zinc-500 mt-1" />
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-zinc-200 font-medium mr-1 text-xs uppercase tracking-wider">AI Reasoning:</span>
                {signal.reasoning || signal.data?.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
