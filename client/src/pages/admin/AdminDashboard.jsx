import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  // Analytics
  const [analytics, setAnalytics] = useState(null);

  // Users
  const [users, setUsers] = useState([]);

  // Draws
  const [draws, setDraws] = useState([]);
  const [drawMonth, setDrawMonth] = useState('');
  const [drawType, setDrawType] = useState('random');
  const [simulatedDraw, setSimulatedDraw] = useState(null);

  // Charities
  const [charities, setCharities] = useState([]);
  const [charityForm, setCharityForm] = useState({ name: '', description: '', image: '', isFeatured: false });
  const [editingCharity, setEditingCharity] = useState(null);

  // Winners
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
    fetchDraws();
    fetchCharities();
    fetchWinners();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {}
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {}
  };

  const fetchDraws = async () => {
    try {
      const res = await axios.get('/draws');
      setDraws(res.data.draws);
    } catch (err) {}
  };

  const fetchCharities = async () => {
    try {
      const res = await axios.get('/charities');
      setCharities(res.data.charities);
    } catch (err) {}
  };

  const fetchWinners = async () => {
    try {
      const res = await axios.get('/admin/winners');
      setWinners(res.data.prizes);
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Draw handlers
  const handleSimulate = async () => {
    if (!drawMonth) return toast.error('Month enter karo');
    try {
      const res = await axios.post('/draws/simulate', { month: drawMonth, drawType });
      setSimulatedDraw(res.data.draw);
      toast.success('Draw simulate ho gaya!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulate nahi hua');
    }
  };

  const handlePublish = async (drawId) => {
    try {
      const res = await axios.put(`/draws/publish/${drawId}`);
      toast.success('Draw publish ho gaya!');
      setSimulatedDraw(null);
      setDrawMonth('');
      fetchDraws();
      fetchWinners();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publish nahi hua');
    }
  };

  // Charity handlers
  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCharity) {
        await axios.put(`/charities/${editingCharity._id}`, charityForm);
        toast.success('Charity update ho gayi!');
        setEditingCharity(null);
      } else {
        await axios.post('/charities', charityForm);
        toast.success('Charity add ho gayi!');
      }
      setCharityForm({ name: '', description: '', image: '', isFeatured: false });
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya');
    }
  };

  const handleDeleteCharity = async (id) => {
    try {
      await axios.delete(`/charities/${id}`);
      toast.success('Charity delete ho gayi!');
      fetchCharities();
    } catch (err) {
      toast.error('Delete nahi hua');
    }
  };

  const handleEditCharity = (charity) => {
    setEditingCharity(charity);
    setCharityForm({
      name: charity.name,
      description: charity.description,
      image: charity.image,
      isFeatured: charity.isFeatured
    });
    setActiveTab('charities');
  };

  // Winner handlers
  const handleVerify = async (id, status) => {
    try {
      await axios.put(`/admin/winners/${id}/verify`, { status });
      toast.success(`Winner ${status}!`);
      fetchWinners();
    } catch (err) {
      toast.error('Error aaya');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await axios.put(`/admin/winners/${id}/paid`);
      toast.success('Payment complete mark ho gayi!');
      fetchWinners();
    } catch (err) {
      toast.error('Error aaya');
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success('User delete ho gaya!');
      fetchUsers();
      fetchAnalytics();
    } catch (err) {
      toast.error('Delete nahi hua');
    }
  };

  const tabs = ['analytics', 'users', 'draws', 'charities', 'winners'];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-green-400 font-bold text-lg">⛳ GolfPro</span>
          <span className="text-xs bg-red-900/40 text-red-400 border border-red-900 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 border border-red-900 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 sticky top-[57px] z-10">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-all
                ${activeTab === tab
                  ? 'border-green-500 text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-4">

        {/* ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Users', value: analytics.totalUsers, color: 'text-white' },
                { label: 'Active Subscriptions', value: analytics.activeSubscriptions, color: 'text-green-400' },
                { label: 'Total Charities', value: analytics.totalCharities, color: 'text-pink-400' },
                { label: 'Total Draws', value: analytics.totalDraws, color: 'text-blue-400' },
                { label: 'Prize Pool', value: `$${analytics.totalPrizePool}`, color: 'text-amber-400' },
                { label: 'Charity Total', value: `$${analytics.totalCharityContribution}`, color: 'text-emerald-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                Winners Overview
              </h2>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500">Total Winners</p>
                  <p className="text-xl font-bold text-white">{analytics.totalWinners}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-xl font-bold text-green-400">{analytics.totalPaid}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-amber-400">{analytics.totalPending}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                All Users ({users.length})
              </h2>
            </div>
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm p-5">Koi user nahi hai</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {users.map(u => (
                  <div key={u._id} className="p-4 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${u.subscriptionStatus === 'active'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-gray-800 text-gray-500'}`}>
                        {u.subscriptionStatus}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${u.role === 'admin'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-gray-800 text-gray-500'}`}>
                        {u.role}
                      </span>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-xs text-red-500 hover:text-red-400 border border-red-900 px-2 py-1 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DRAWS */}
        {activeTab === 'draws' && (
          <div className="space-y-4">
            {/* Simulate */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                Simulate Draw
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="month"
                  value={drawMonth}
                  onChange={e => setDrawMonth(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors"
                />
                <select
                  value={drawType}
                  onChange={e => setDrawType(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors"
                >
                  <option value="random">Random Draw</option>
                  <option value="algorithmic">Algorithmic Draw</option>
                </select>
                <button
                  onClick={handleSimulate}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Simulate
                </button>
              </div>

              {/* Simulated Result */}
              {simulatedDraw && (
                <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-bold text-white">
                    Simulated — {simulatedDraw.month}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {simulatedDraw.winningNumbers.map((num, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center font-bold text-sm text-green-400">
                        {num}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>Pool: ${simulatedDraw.totalPrizePool}</span>
                    <span>Jackpot: ${simulatedDraw.jackpotAmount?.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handlePublish(simulatedDraw._id)}
                    className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    Publish Draw
                  </button>
                </div>
              )}
            </div>

            {/* Published Draws */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                Published Draws ({draws.length})
              </h2>
              {draws.length === 0 ? (
                <p className="text-gray-500 text-sm">Koi published draw nahi hai</p>
              ) : (
                <div className="space-y-3">
                  {draws.map(draw => (
                    <div key={draw._id} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-white text-sm">{draw.month}</p>
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">
                          Published
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {draw.winningNumbers.map((num, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center font-bold text-xs text-gray-300">
                            {num}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Pool: ${draw.totalPrizePool} · Jackpot: ${draw.jackpotAmount?.toFixed(2)}
                        {draw.jackpotRolledOver && ' · 🔄 Rolled Over'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHARITIES */}
        {activeTab === 'charities' && (
          <div className="space-y-4">
            {/* Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                {editingCharity ? 'Edit Charity' : 'Add Charity'}
              </h2>
              <form onSubmit={handleCharitySubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Charity Name"
                  value={charityForm.name}
                  onChange={e => setCharityForm({ ...charityForm, name: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder-gray-600"
                />
                <textarea
                  placeholder="Description"
                  value={charityForm.description}
                  onChange={e => setCharityForm({ ...charityForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder-gray-600 resize-none"
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={charityForm.image}
                  onChange={e => setCharityForm({ ...charityForm, image: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder-gray-600"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={charityForm.isFeatured}
                    onChange={e => setCharityForm({ ...charityForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="text-sm text-gray-400">Featured charity</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    {editingCharity ? 'Update Charity' : 'Add Charity'}
                  </button>
                  {editingCharity && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCharity(null);
                        setCharityForm({ name: '', description: '', image: '', isFeatured: false });
                      }}
                      className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                  All Charities ({charities.length})
                </h2>
              </div>
              {charities.length === 0 ? (
                <p className="text-gray-500 text-sm p-5">Koi charity nahi hai</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {charities.map(charity => (
                    <div key={charity._id} className="p-4 flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{charity.name}</p>
                          {charity.isFeatured && (
                            <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {charity.description}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditCharity(charity)}
                          className="text-xs text-blue-400 border border-blue-900 px-2 py-1 rounded-lg hover:bg-blue-900/20 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCharity(charity._id)}
                          className="text-xs text-red-400 border border-red-900 px-2 py-1 rounded-lg hover:bg-red-900/20 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WINNERS */}
        {activeTab === 'winners' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                All Winners ({winners.length})
              </h2>
            </div>
            {winners.length === 0 ? (
              <p className="text-gray-500 text-sm p-5">Koi winner nahi hai abhi</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {winners.map(prize => (
                  <div key={prize._id} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {prize.userId?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{prize.userId?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400 text-sm">
                          ${prize.amount?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{prize.matchType}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${prize.status === 'paid' ? 'bg-green-900/30 text-green-400'
                        : prize.status === 'verified' ? 'bg-blue-900/30 text-blue-400'
                        : prize.status === 'rejected' ? 'bg-red-900/30 text-red-400'
                        : 'bg-amber-900/30 text-amber-400'}`}>
                        {prize.status}
                      </span>
                      {prize.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(prize._id, 'verified')}
                            className="text-xs text-blue-400 border border-blue-900 px-2 py-0.5 rounded-lg hover:bg-blue-900/20 transition-all"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleVerify(prize._id, 'rejected')}
                            className="text-xs text-red-400 border border-red-900 px-2 py-0.5 rounded-lg hover:bg-red-900/20 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {prize.status === 'verified' && (
                        <button
                          onClick={() => handleMarkPaid(prize._id)}
                          className="text-xs text-green-400 border border-green-900 px-2 py-0.5 rounded-lg hover:bg-green-900/20 transition-all"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;