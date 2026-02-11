import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronLeft, ChevronRight, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { getCreators, Creator } from '@/lib/api';

const Home = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCreators, setTotalCreators] = useState(0);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const response = await getCreators(page, 10);
        setCreators(response.creators);
        setTotalPages(response.pagination.totalPages);
        setTotalCreators(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [page]);

  const handleRowClick = (handle: string) => {
    navigate(`/creator/${handle}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': 
      case 'ACTIVE': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'PROCESSING': 
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ERROR': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Creator Leaderboard
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Discover top creators ranked by credibility and affiliation analysis.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-zinc-800/50 border-b border-zinc-800 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5">Creator</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Affiliation</div>
          <div className="col-span-2 text-center">Credibility</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-800">
          {loading ? (
            // Loading Skeletons
            [...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 animate-pulse">
                <div className="col-span-1 bg-zinc-800 h-6 rounded"></div>
                <div className="col-span-5 bg-zinc-800 h-6 rounded"></div>
                <div className="col-span-2 bg-zinc-800 h-6 rounded"></div>
                <div className="col-span-2 bg-zinc-800 h-6 rounded"></div>
                <div className="col-span-2 bg-zinc-800 h-6 rounded"></div>
              </div>
            ))
          ) : creators.length > 0 ? (
            creators.map((creator, index) => (
              <div 
                key={creator._id}
                onClick={() => handleRowClick(creator.handle)}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/50 cursor-pointer transition-colors group"
              >
                <div className="col-span-1 text-center font-mono text-zinc-500 group-hover:text-white">
                  #{(page - 1) * 10 + index + 1}
                </div>
                
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden shrink-0">
                    {creator.profileImage ? (
                      <img src={creator.profileImage} alt={creator.handle} className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {creator.displayName || `@${creator.handle}`}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">@{creator.handle}</p>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(creator.status)}`}>
                    {creator.status}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center">
                  {creator.affiliationScore !== undefined ? (
                    <div className="flex items-center gap-2">
                       <TrendingUp className="h-4 w-4 text-purple-400" />
                       <span className="font-bold text-white">{creator.affiliationScore}%</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </div>

                <div className="col-span-2 flex justify-center">
                  {creator.credibilityScore !== undefined ? (
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-green-400" />
                       <span className="font-bold text-white">{creator.credibilityScore}%</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-zinc-800 mb-6">
                <AlertCircle className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No creators found</h3>
              <p className="text-zinc-400">Be the first to add a creator to the leaderboard!</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-zinc-800/50 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Showing <span className="font-medium text-white">{creators.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="font-medium text-white">{Math.min(page * 10, totalCreators)}</span> of <span className="font-medium text-white">{totalCreators}</span> creators
          </p>
          <div className="flex bg-zinc-900 rounded-lg p-1 gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-400" />
            </button>
            <div className="flex items-center px-4 font-medium text-zinc-400">
              Page {page} of {totalPages || 1}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
