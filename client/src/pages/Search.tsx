import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import AddCreatorModal from '../components/creators/AddCreatorModal';

interface Creator {
  handle: string;
  displayName?: string;
  status: string;
  affiliationScore?: number;
  credibilityScore?: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await api.get(`/creators?query=${query}`);
        setCreators(response.data.creators);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-white mb-8">
        {loading ? 'Searching...' : `Search Results for "${query}"`}
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : creators.length > 0 ? (
        <div className="grid gap-4">
          {creators.map((creator) => (
            <Link
              key={creator.handle}
              to={`/creator/${creator.handle}`}
              className="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <Users className="h-6 w-6 text-zinc-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">@{creator.handle}</h3>
                  <p className="text-sm text-zinc-500">{creator.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {creator.credibilityScore !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Credibility</p>
                    <p className="font-bold text-blue-400">{creator.credibilityScore}%</p>
                  </div>
                )}
                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-zinc-800 mb-6">
            <AlertCircle className="h-8 w-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Creator not found</h2>
          <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
            We don't have this creator in our database yet. Would you like to add them for analysis?
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all"
          >
            Add @{query} now
          </button>
        </div>
      )}
      
      <AddCreatorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Search;
