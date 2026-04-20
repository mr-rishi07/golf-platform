import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <span className="text-green-400 font-bold text-lg">⛳ GolfPro</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/charities')}
            className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            Charities
          </button>
          {user ? (
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
              className="text-sm bg-green-500 hover:bg-green-400 text-gray-950 font-bold px-4 py-2 rounded-xl transition-all"
            >
              Dashboard
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm bg-green-500 hover:bg-green-400 text-gray-950 font-bold px-4 py-1.5 rounded-xl transition-all"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
        <span className="text-xs text-green-400 uppercase tracking-widest border border-green-900 px-3 py-1 rounded-full">
          Play Golf · Win Prizes · Give Back
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-xl">
          Golf jo acha kare — <span className="text-green-400">tumhare liye</span> aur{' '}
          <span className="text-green-400">duniya ke liye</span>
        </h1>
        <p className="text-gray-400 text-base max-w-md">
          Apne golf scores enter karo, monthly prize draws mein participate karo,
          aur apni favourite charity ko support karo — sab ek platform pe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={() => navigate('/register')}
            className="flex-1 bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm"
          >
            Start for Free →
          </button>
          <button
            onClick={() => navigate('/charities')}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 font-bold py-3 rounded-xl transition-all text-sm"
          >
            Browse Charities
          </button>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-3xl mx-auto w-full px-4 py-12 space-y-8">
        <h2 className="text-2xl font-bold text-center text-white">Kaise Kaam Karta Hai?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Subscribe Karo',
              desc: 'Monthly ya yearly plan choose karo. Har subscription ka ek hissa charity ko jaata hai.',
              color: 'text-green-400'
            },
            {
              step: '02',
              title: 'Scores Enter Karo',
              desc: 'Apne latest 5 golf scores Stableford format mein enter karo. Simple aur fast.',
              color: 'text-blue-400'
            },
            {
              step: '03',
              title: 'Jeet aur Do',
              desc: 'Monthly draw mein participate karo. Prizes jeeto aur charity ko support karo.',
              color: 'text-amber-400'
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
              <span className={`text-xs font-bold ${item.color} uppercase tracking-widest`}>
                {item.step}
              </span>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool Section */}
      <section className="bg-gray-900 border-y border-gray-800 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center text-white">Prize Pool Distribution</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { match: '5 Number Match', share: '40%', note: 'Jackpot — rollover if unclaimed', color: 'border-green-900/50 text-green-400' },
              { match: '4 Number Match', share: '35%', note: 'Split equally among winners', color: 'border-blue-900/50 text-blue-400' },
              { match: '3 Number Match', share: '25%', note: 'Split equally among winners', color: 'border-amber-900/50 text-amber-400' },
            ].map((item, i) => (
              <div key={i} className={`bg-gray-950 border ${item.color} rounded-2xl p-5 text-center space-y-1`}>
                <p className={`text-3xl font-bold ${item.color.split(' ')[1]}`}>{item.share}</p>
                <p className="font-bold text-white text-sm">{item.match}</p>
                <p className="text-xs text-gray-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity Impact */}
      <section className="max-w-3xl mx-auto w-full px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">❤️ Charity First</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Har subscription ka minimum 10% seedha charity ko jaata hai.
            Tum chaaho to aur zyada de sakte ho.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Minimum Contribution', value: '10%', sub: 'of every subscription', color: 'text-green-400' },
            { label: 'You Choose', value: '100+', sub: 'charities to support', color: 'text-pink-400' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <p className={`text-4xl font-bold ${item.color} mb-1`}>{item.value}</p>
              <p className="font-bold text-white text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12">
        <div className="max-w-md mx-auto bg-gradient-to-br from-green-900/30 to-emerald-900/10 border border-green-900/40 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to Play?</h2>
          <p className="text-gray-400 text-sm">
            Join karo aur pehle draw mein participate karo.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm"
          >
            Subscribe Now →
          </button>
          <p className="text-xs text-gray-600">
            Monthly $10 · Yearly $100 · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-6 text-center">
        <p className="text-xs text-gray-600">
          © 2026 GolfPro Platform · Built with ❤️ for charity
        </p>
      </footer>

    </div>
  );
};

export default Home;