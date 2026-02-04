import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle, Twitter, Users, ShieldCheck, Activity, Brain } from 'lucide-react';
import api from '../lib/api';
import SignalCard from '../components/creators/SignalCard';
import AffiliationGauge from '../components/creators/AffiliationGauge';
import ScoreTimeline from '../components/creators/ScoreTimeline';

interface CreatorMetadata {
  followersCount?: number;
  description?: string;
}

interface Creator {
  handle: string;
  status: 'PENDING' | 'ACTIVE' | 'ERROR';
  displayName?: string;
  profileImage?: string;
  metadata?: CreatorMetadata;
  affiliationScore?: number;
  credibilityScore?: number;
}

const CreatorProfile = () => {
  const { handle } = useParams<{ handle: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignalsLoading, setIsSignalsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    try {
      setIsSignalsLoading(true);
      const response = await api.get(`/creators/${handle}/signals`);
      setSignals(response.data.signals);
    } catch (err) {
      console.error('Failed to load signals:', err);
    } finally {
      setIsSignalsLoading(false);
    }
  }, [handle]);

  const fetchCreator = useCallback(async () => {
    try {
      const response = await api.get(`/creators/${handle}`);
      setCreator(response.data.creator);
      setError(null);
      
      // If creator is ACTIVE, fetch signals
      if (response.data.creator.status === 'ACTIVE') {
        fetchSignals();
      }
      
      return response.data.creator;
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Creator not found');
      } else {
        setError('Failed to load creator profile');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handle, fetchSignals]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const startPolling = async () => {
      const data = await fetchCreator();
      
      if (data && data.status === 'PENDING') {
        pollInterval = setInterval(async () => {
          const updatedData = await fetchCreator();
          if (updatedData && updatedData.status !== 'PENDING') {
            clearInterval(pollInterval);
          }
        }, 5000); // Poll every 5 seconds
      }
    };

    startPolling();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [fetchCreator]);

  if (isLoading && !creator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
        <p>We couldn't find the creator you're looking for.</p>
      </div>
    );
  }

  if (creator?.status === 'PENDING') {
    return (
      <div className="py-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <div className="bg-blue-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Scanning Profile</h1>
          <p className="text-zinc-400 mb-8">
            We're currently gathering data for <span className="text-blue-400 font-semibold">@{handle}</span>. 
            This usually takes about 30-60 seconds.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Waiting for initial ingestion...</span>
          </div>
        </div>
      </div>
    );
  }

  if (creator?.status === 'ERROR') {
    return (
      <div className="py-8">
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-12 text-center max-w-2xl mx-auto">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Analysis Failed</h1>
          <p className="text-zinc-400">
            We encountered an error while scanning <span className="text-red-400 font-semibold">@{handle}</span>. 
            This might be due to a private account or a temporary connection issue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="relative">
          <img 
            src={creator?.profileImage || `https://ui-avatars.com/api/?name=${creator?.displayName || handle}&background=random`} 
            alt={creator?.handle}
            className="w-24 h-24 rounded-full border-2 border-zinc-800 shadow-xl"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full border-2 border-zinc-900">
            <Twitter className="h-4 w-4 text-white fill-current" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">{creator?.displayName || handle}</h1>
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-zinc-400 text-lg mb-4">@{creator?.handle}</p>
          <p className="text-zinc-300 max-w-2xl mx-auto md:mx-0">{creator?.metadata?.description}</p>
        </div>

        <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
          <div className="px-6 py-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex-1 md:min-w-[160px]">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Users className="h-4 w-4" />
              <span>Followers</span>
            </div>
            <div className="text-2xl font-bold text-white break-all">
              {new Intl.NumberFormat().format(creator?.metadata?.followersCount || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Ideological Alignment
            </h3>
            
            {signals.filter(s => s.type === 'affiliation').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Aggregate View */}
                <div className="bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800/50">
                  <AffiliationGauge 
                    score={(creator?.affiliationScore || 0) / 50 - 1} 
                    label="Overall Leaning"
                  />
                </div>
                
                {/* Top Entities */}
                <div className="space-y-4">
                  <div className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Key Influences</div>
                  {signals
                    .filter(s => s.type === 'affiliation')
                    .flatMap(s => s.data?.entities || [])
                    .slice(0, 3)

                    .map((ent, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300 font-medium capitalize">{ent.name}</span>
                        <span className={`font-bold ${ent.sentiment === '+' ? 'text-blue-500' : 'text-red-500'}`}>
                          {ent.sentiment === '+' ? 'HIGH' : 'LOW'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-600 italic">No affiliations mapped yet</div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Credibility Timeline
              </h3>
              <div className="text-2xl font-black text-emerald-500">{creator?.credibilityScore || 0}%</div>
            </div>
            
            <ScoreTimeline signals={signals} />
          </div>
        </div>
      </div>

      {/* AI Signals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-500" />
            AI Analysis Signals
          </h2>
          {isSignalsLoading && (
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating analysis...</span>
            </div>
          )}
        </div>

        {signals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {signals.map((signal, idx) => (
              <SignalCard key={signal._id || idx} signal={signal} />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-12 text-center text-zinc-500">
            {creator?.status === 'ACTIVE' ? (
              <>
                <div className="bg-zinc-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
                <p>AI is currently processing latest content...</p>
                <p className="text-xs mt-2">Experimental signals will appear here shortly.</p>
              </>
            ) : (
              <p>Signals will appear once analysis is complete.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
