import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface ScoreTimelineProps {
  signals: any[];
}

const ScoreTimeline = ({ signals }: ScoreTimelineProps) => {
  // Extract and sort credibility signals by date
  const data = signals
    .filter(s => s.type === 'credibility')
    .map(s => {
      let score = 0;
      
      if (s.data?.claims && Array.isArray(s.data.claims)) {
        let verifiableClaims = 0;
        let claimsWithEvidence = 0;
        
        s.data.claims.forEach((c: any) => {
          if (c.verifiable) verifiableClaims++;
          if (c.hasEvidence) claimsWithEvidence++;
        });

        const evidenceRatio = verifiableClaims > 0 ? (claimsWithEvidence / verifiableClaims) : 1.0;
        const confidence = (s.data.overallConfidence || '').toLowerCase();
        const confidenceWeight = confidence === 'high' ? 1.0 : (confidence === 'medium' ? 0.7 : 0.4);
        const consistency = s.data.contradictionsFound ? 0.5 : 1.0;
        
        score = Math.round(((evidenceRatio * 0.6) + (confidenceWeight * 0.2) + (consistency * 0.2)) * 100);
      } else if (typeof s.data?.score === 'number') {
        score = s.data.score;
      } else if (typeof s.score === 'number') {
        score = s.score;
      }

      return {
        timestamp: new Date(s.createdAt).getTime(),
        displayDate: new Date(s.createdAt).toLocaleDateString(),
        score: score
      };
    })
    .filter(item => item.score > 0) // Only include points where we could calculate a score
    .sort((a, b) => a.timestamp - b.timestamp);

  if (data.length < 2) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 italic text-sm p-8 text-center">
        <p>Not enough history to generate timeline.</p>
        <p className="text-xs mt-1">Requires at least 2 analysis signals.</p>
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="displayDate" 
            hide 
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#71717a', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#18181b', 
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#10b981' }}
            labelStyle={{ display: 'none' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#18181b' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreTimeline;
