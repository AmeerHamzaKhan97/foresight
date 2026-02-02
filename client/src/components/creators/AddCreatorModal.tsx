import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

interface AddCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCreatorModal: React.FC<AddCreatorModalProps> = ({ isOpen, onClose }) => {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setHandle('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const extractHandle = (input: string) => {
    try {
      if (input.includes('twitter.com/') || input.includes('x.com/')) {
        const url = new URL(input.startsWith('http') ? input : `https://${input}`);
        return url.pathname.split('/')[1]?.replace('@', '') || '';
      }
      return input.replace('@', '').trim();
    } catch {
      return input.replace('@', '').trim();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanHandle = extractHandle(handle);
    if (!cleanHandle) {
      setError('Please enter a valid Twitter handle or URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/creators', { url: `https://x.com/${cleanHandle}` });
      const newHandle = response.data.creator.handle;
      setHandle('');
      onClose();
      navigate(`/creator/${newHandle}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Already exists, just navigate
        const existingHandle = err.response.data.creator.handle;
        onClose();
        navigate(`/creator/${existingHandle}`);
      } else {
        setError(err.response?.data?.error || 'Failed to add creator. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Add New Creator</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="handle" className="block text-sm font-medium text-zinc-400">
                Twitter/X Handle or Profile URL
              </label>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
              
              <input
                id="handle"
                type="text"
                placeholder="e.g. elonmusk or x.com/elonmusk"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                autoFocus
              />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !handle}
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                'Add Creator'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCreatorModal;
