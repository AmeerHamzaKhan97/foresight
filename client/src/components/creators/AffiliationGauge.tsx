

interface AffiliationGaugeProps {
  score: number; // -1 to 1
  label: string;
}

const AffiliationGauge = ({ score, label }: AffiliationGaugeProps) => {
  // Map -1..1 to 0..100 for visual percentage
  const percentage = ((score + 1) / 2) * 100;
  
  // Calculate color based on score
  // -1 (Red/Left) -> 0 (Gray/Center) -> 1 (Blue/Right)
  const getLeaningColor = (s: number) => {
    if (s < -0.2) return 'text-red-500';
    if (s > 0.2) return 'text-blue-500';
    return 'text-zinc-400';
  };

  const getBarColor = (s: number) => {
    if (s < -0.2) return 'bg-red-600';
    if (s > 0.2) return 'bg-blue-600';
    return 'bg-zinc-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
          <div className={`text-3xl font-black ${getLeaningColor(score)}`}>
            {score > 0 ? '+' : ''}{score.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-600 uppercase mb-1">Polarity</div>
          <div className="text-lg font-bold text-zinc-300">
            {Math.abs(score * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="relative h-4 w-full bg-zinc-800/50 rounded-full border border-zinc-700/30 overflow-hidden">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-700 z-10" />
        
        {/* Fill bar */}
        <div 
          className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out ${getBarColor(score)}`}
          style={{ 
            left: score >= 0 ? '50%' : `${percentage}%`,
            right: score >= 0 ? `${100 - percentage}%` : '50%'
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter text-zinc-600">
        <span>Critical</span>
        <span>Neutral</span>
        <span>Supportive</span>
      </div>
    </div>
  );
};

export default AffiliationGauge;
