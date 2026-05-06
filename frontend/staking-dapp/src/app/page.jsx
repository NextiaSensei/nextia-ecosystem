'use client';

import { useWeb3 } from '@/context/Web3Context';
import { TrendingUp, Lock, Gift, Vote } from 'lucide-react';

export default function Home() {
  const { isConnected, userData } = useWeb3();

  const stats = [
    {
      label: 'Balance NXT',
      value: isConnected ? `${parseFloat(userData.tokenBalance).toFixed(2)}` : '0.00',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Staked Amount',
      value: isConnected ? `${parseFloat(userData.stakedAmount).toFixed(2)}` : '0.00',
      icon: Lock,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Pending Rewards',
      value: isConnected ? `${parseFloat(userData.pendingRewards).toFixed(4)}` : '0.0000',
      icon: Gift,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Governance Power',
      value: isConnected ? `${(parseFloat(userData.tokenBalance) / 1000).toFixed(1)}x` : '0.0x',
      icon: Vote,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          NextiaToken Ecosystem
        </h1>
        <p className="text-gray-400 text-lg">
          {isConnected ? '📊 Your Dashboard' : '🔗 Connect your wallet to get started'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition group"
            >
              <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value} NXT</p>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staking Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📍 Staking
          </h2>
          <p className="text-gray-400 mb-4">
            Earn ~20% APY by staking your NXT tokens. No lock-in period required.
          </p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            <li>✅ Instant rewards calculation</li>
            <li>✅ No withdrawal penalties</li>
            <li>✅ Flexible staking period</li>
            <li>✅ Compound your earnings</li>
          </ul>
          <a
            href="/staking"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            Start Staking →
          </a>
        </div>

        {/* Rewards Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎁 Reward Pools
          </h2>
          <p className="text-gray-400 mb-4">
            Participate in limited-time reward campaigns with proportional distributions.
          </p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            <li>✅ Time-limited campaigns</li>
            <li>✅ Fixed reward pools</li>
            <li>✅ Transparent distribution</li>
            <li>✅ Early exit available</li>
          </ul>
          <a
            href="/rewards"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            Explore Pools →
          </a>
        </div>
      </div>

      {/* Governance Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🗳️ Governance
        </h2>
        <p className="text-gray-400 mb-4">
          Hold 1,000+ NXT to propose changes. 1 token = 1 vote. Shape the future of NextiaToken.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Voting Power</p>
            <p className="text-2xl font-bold text-purple-400">
              {isConnected ? `${(parseFloat(userData.tokenBalance) / 1).toFixed(0)}` : '0'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Can Propose</p>
            <p className="text-2xl font-bold text-green-400">
              {isConnected && parseFloat(userData.tokenBalance) >= 1000 ? '✅ Yes' : '❌ No'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Min Required</p>
            <p className="text-2xl font-bold text-orange-400">1,000</p>
          </div>
        </div>
        <a
          href="/governance"
          className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
        >
          Go to Governance →
        </a>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/10 rounded-xl p-6 text-center">
        <p className="text-gray-400">
          📚 Need help? Check out our{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 transition">
            documentation
          </a>{' '}
          or join the{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 transition">
            community
          </a>
        </p>
      </div>
    </div>
  );
}
