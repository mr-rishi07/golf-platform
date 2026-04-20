import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Charities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await axios.get('/charities');
      setCharities(res.data.charities);
    } catch (err) {
      toast.error('Charities load nahi hui');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (charityId) => {
    if (!user) return navigate('/login');
    try {
      await axios.put(`/subscriptions/charity`, { charityId });
      toast.success('Charity select ho gayi!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya');
    }
  };

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.filter(c => c.isFeatured);
  const regular = filtered.filter(c => !c.isFeatured);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <span
          onClick={() => navigate('/')}
          className="text-green-400 font-bold text-lg cursor-pointer"
        >
          ⛳ GolfPro
        </span>
        <div className="flex gap-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-green-400 border border-green-900 px-3 py-1.5 rounded-lg hover:bg-green-900/20 transition-all"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-green-400 border border-green-900 px-3 py-1.5 rounded-lg hover:bg-green-900/20 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Our Charities</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Har subscription se charity ko direct support milta hai. Apni charity choose karo.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search charities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder-gray-600"
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Koi charity nahi mili
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-medium">
                  ⭐ Featured This Month
                </p>
                {featured.map(charity => (
                  <div key={charity._id}
                    className="bg-gray-900 border border-amber-900/40 rounded-2xl p-5 space-y-3">
                    {charity.image && (
                      <img
                        src={charity.image}
                        alt={charity.name}
                        className="w-full h-40 object-cover rounded-xl"
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="font-bold text-white text-lg">{charity.name}</h2>
                          <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{charity.description}</p>
                      </div>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleSelect(charity._id)}
                        className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-2.5 rounded-xl transition-all text-sm"
                      >
                        Select This Charity
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Regular */}
            {regular.length > 0 && (
              <div className="space-y-3">
                {featured.length > 0 && (
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                    All Charities
                  </p>
                )}
                {regular.map(charity => (
                  <div key={charity._id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                    {charity.image && (
                      <img
                        src={charity.image}
                        alt={charity.name}
                        className="w-full h-32 object-cover rounded-xl"
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <h2 className="font-bold text-white mb-1">{charity.name}</h2>
                      <p className="text-sm text-gray-400">{charity.description}</p>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleSelect(charity._id)}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-900/50 font-bold py-2.5 rounded-xl transition-all text-sm"
                      >
                        Select This Charity
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Charities;