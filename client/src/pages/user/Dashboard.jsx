import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [draws, setDraws] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchScores();
    fetchSubscription();
    fetchDraws();
    fetchWinnings();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await axios.get('/scores');
      setScores(res.data.scores);
    } catch (err) {}
  };

  const fetchSubscription = async () => {
    try {
      const res = await axios.get('/subscriptions');
      setSubscription(res.data.subscription);
    } catch (err) {}
  };

  const fetchDraws = async () => {
    try {
      const res = await axios.get('/draws');
      setDraws(res.data.draws);
    } catch (err) {}
  };

  const fetchWinnings = async () => {
    try {
      const res = await axios.get('/draws/my-winnings');
      setWinnings(res.data.prizes);
    } catch (err) {}
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/scores', { value: Number(value), date });
      toast.success('Score add ho gaya!');
      setValue('');
      setDate('');
      fetchScores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Score add nahi hua');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScore = async (id) => {
    try {
      await axios.delete(`/scores/${id}`);
      toast.success('Score delete ho gaya!');
      fetchScores();
    } catch (err) {
      toast.error('Score delete nahi hua');
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      await axios.post('/subscriptions', { plan, charityPercentage: 10 });
      toast.success('Subscription active ho gayi!');
      fetchSubscription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription nahi hui');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const latestDraw = draws[0];
  const userScoreValues = scores.map(s => s.value);
  const matchedNumbers = latestDraw
    ? latestDraw.winningNumbers.filter(n => userScoreValues.includes(n))
    : [];

  const totalWon = winnings.reduce((sum, w) => sum + w.amount, 0);

  const tabs = ['overview', 'scores', 'draws', 'winnings'];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <span className="text-green-400 font-bold text-lg tracking-tight">⛳ GolfPro</span>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-gray-950 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 border border-red-900 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Banner — Charity Impact */}
      {subscription?.status === 'active' && (
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/20 border-b border-green-900/30 px-4 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="text-xs text-green-400 uppercase tracking-widest">Your Impact</p>
                <p className="text-white font-bold">
                  ${subscription.charityContribution} donated to charity this month
                </p>
              </div>
            </div>
            <div className="h-px sm:h-8 sm:w-px bg-green-900/50" />
            <div>
              <p className="text-xs text-green-400 uppercase tracking-widest">Prize Pool</p>
              <p className="text-white font-bold">${subscription.prizePoolContribution} contributed</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 sticky top-[57px] z-10">
        <div className="max-w-3xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide">
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
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Subscription</p>
                <p className="font-bold capitalize text-white">
                  {subscription?.plan || 'None'}
                </p>
                <span className={`text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full
                  ${subscription?.status === 'active'
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-red-900/30 text-red-400'}`}>
                  {subscription?.status === 'active' ? '● Active' : '● Inactive'}
                </span>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Scores Entered</p>
                <p className="font-bold text-white text-xl">{scores.length}/5</p>
                <span className="text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
                  This Month
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Total Winnings</p>
                <p className="font-bold text-white text-xl">${totalWon.toFixed(2)}</p>
                <span className="text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400">
                  All Time
                </span>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                Subscription
              </h2>
              {subscription?.status === 'active' ? (
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <p className="text-green-400 font-bold text-lg capitalize">
                      {subscription.plan} Plan
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      ${subscription.amount} ·
                      Renews {new Date(subscription.renewalDate).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Charity: {subscription.charityPercentage}% · Prize Pool: ${subscription.prizePoolContribution}
                    </p>
                  </div>
                  <span className="self-start bg-green-900/30 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-900 whitespace-nowrap">
                    ● Active
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Subscribe karo aur monthly draws mein participate karo!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSubscribe('monthly')}
                      className="flex-1 bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      Monthly — $10/mo
                    </button>
                    <button
                      onClick={() => handleSubscribe('yearly')}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-blue-400 border border-blue-900/50 font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      Yearly — $100/yr
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Latest Draw Preview */}
            {latestDraw && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                    Latest Draw
                  </h2>
                  <span className="text-xs text-gray-500">{latestDraw.month}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {latestDraw.winningNumbers.map((num, i) => (
                    <div key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                        ${matchedNumbers.includes(num)
                          ? 'bg-green-900/50 border-green-500 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <p className={`text-xs px-3 py-1.5 rounded-full inline-block
                  ${matchedNumbers.length > 0
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-gray-800 text-gray-500'}`}>
                  {matchedNumbers.length > 0
                    ? `🎉 ${matchedNumbers.length} number match kiye!`
                    : 'Koi match nahi — keep playing!'}
                </p>
              </div>
            )}
          </>
        )}

        {/* SCORES TAB */}
        {activeTab === 'scores' && (
          <div className="space-y-4">
            {/* Add Score Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                Add New Score
              </h2>
              <form onSubmit={handleAddScore} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1.5">Score (1–45)</label>
                    <input
                      type="number" min="1" max="45"
                      value={value}
                      onChange={e => setValue(e.target.value)}
                      required
                      placeholder="e.g. 32"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors placeholder-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1.5">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? 'Adding...' : '+ Add Score'}
                </button>
              </form>
            </div>

            {/* Scores List */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">
                My Last 5 Scores
              </h2>
              {scores.length === 0 ? (
                <p className="text-gray-500 text-sm">Koi score nahi hai — upar se add karo!</p>
              ) : (
                <div className="space-y-2">
                  {scores.map((score, index) => (
                    <div key={score._id}
                      className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
                      <span className="text-xs text-gray-600 w-5">#{index + 1}</span>
                      <span className="text-lg font-bold text-green-400 w-9">{score.value}</span>
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full">
                        <div
                          className="h-1.5 bg-green-500 rounded-full transition-all"
                          style={{ width: `${(score.value / 45) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(score.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                      <button
                        onClick={() => handleDeleteScore(score._id)}
                        className="text-red-500 hover:text-red-400 text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DRAWS TAB */}
        {activeTab === 'draws' && (
          <div className="space-y-4">
            {draws.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-500 text-sm">Abhi koi published draw nahi hai.</p>
              </div>
            ) : (
              draws.map(draw => {
                const matched = draw.winningNumbers.filter(n => userScoreValues.includes(n));
                return (
                  <div key={draw._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-bold text-white">Draw — {draw.month}</h2>
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                        Published
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {draw.winningNumbers.map((num, i) => (
                        <div key={i}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                            ${matched.includes(num)
                              ? 'bg-green-900/50 border-green-500 text-green-400'
                              : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Prize Pool: ${draw.totalPrizePool} ·
                      Jackpot: ${draw.jackpotAmount.toFixed(2)} ·
                      {matched.length > 0
                        ? ` 🎉 ${matched.length} match!`
                        : ' No match'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* WINNINGS TAB */}
        {activeTab === 'winnings' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Won</p>
                <p className="text-xl font-bold text-green-400">${totalWon.toFixed(2)}</p>
              </div>
              <div className="w-px bg-gray-800" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">Prizes</p>
                <p className="text-xl font-bold text-white">{winnings.length}</p>
              </div>
            </div>

            {winnings.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-500 text-sm">Abhi koi winning nahi hai — keep playing!</p>
              </div>
            ) : (
              winnings.map(prize => (
                <div key={prize._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{prize.matchType}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Draw: {prize.drawId?.month}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">${prize.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
                        ${prize.status === 'paid'
                          ? 'bg-green-900/30 text-green-400'
                          : prize.status === 'verified'
                          ? 'bg-blue-900/30 text-blue-400'
                          : prize.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-amber-900/30 text-amber-400'}`}>
                        {prize.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;