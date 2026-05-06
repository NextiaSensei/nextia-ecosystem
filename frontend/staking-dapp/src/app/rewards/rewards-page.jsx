'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Gift } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/lib/constants';

export default function RewardsPage() {
  const { isConnected, userData, contracts } = useWeb3();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState(null);

  useEffect(() => {
    if (isConnected && contracts.rewards) {
      loadPools();
    }
  }, [isConnected, contracts.rewards]);

  const loadPools = async () => {
    try {
      const count = await contracts.rewards.getPoolCount();
      const poolList = [];

      for (let i = 0; i < count; i++) {
        const poolInfo = await contracts.rewards.getPoolInfo(i);
        poolList.push({
          id: i,
          totalReward: ethers.formatEther(poolInfo.totalRewardAmount),
          startTime: new Date(poolInfo.startTime * 1000),
          endTime: new Date(poolInfo.endTime * 1000),
          totalStaked: ethers.formatEther(poolInfo.totalStaked),
          active: poolInfo.active,
        });
      }

      setPools(poolList);
    } catch (err) {
      console.error('Error cargando pools:', err);
    }
  };

  const handleJoinPool = async () => {
    try {
      setLoading(true);

      if (!amount || parseFloat(amount) <= 0) {
        alert('Ingresa un monto válido');
        return;
      }

      if (selectedPool === null) {
        alert('Selecciona un pool');
        return;
      }

      const amountWei = ethers.parseEther(amount);

      // Aprobar token
      const approveTx = await contracts.token.approve(
        CONTRACT_ADDRESSES.REWARDS,
        amountWei
      );
      await approveTx.wait();

      // Unirse al pool
      const joinTx = await contracts.rewards.joinRewardPool(selectedPool, amountWei);
      await joinTx.wait();

      alert('✅ Te uniste al pool!');
      setAmount('');
      await loadPools();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPoolRewards = async (poolId) => {
    try {
      setLoading(true);

      const claimTx = await contracts.rewards.claimPoolRewards(poolId);
      await claimTx.wait();

      alert('✅ Recompensas reclamadas!');
      await loadPools();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <Gift size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Conecta tu Wallet</h2>
        <p className="text-gray-400">Necesitas conectar MetaMask para participar en pools</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          🎁 Reward Pools
        </h1>
        <p className="text-gray-400">Participa en campañas de recompensas limitadas</p>
      </div>

      {/* Pools Activos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Pools Disponibles</h2>

        {pools.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8 text-center">
            <p className="text-gray-400">No hay pools activos en este momento</p>
          </div>
        ) : (
          pools.map((pool) => (
            <div
              key={pool.id}
              className={`bg-gradient-to-br from-slate-800 to-slate-900 border rounded-xl p-6 cursor-pointer transition ${
                selectedPool === pool.id
                  ? 'border-green-500 shadow-lg shadow-green-500/20'
                  : 'border-purple-500/20 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedPool(pool.id)}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Recompensas</p>
                  <p className="text-2xl font-bold text-green-400">{parseFloat(pool.totalReward).toFixed(0)}</p>
                  <p className="text-xs text-gray-500">NXT</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Depositado</p>
                  <p className="text-2xl font-bold text-blue-400">{parseFloat(pool.totalStaked).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">NXT</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Inicio</p>
                  <p className="text-sm font-bold">{pool.startTime.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fin</p>
                  <p className="text-sm font-bold">{pool.endTime.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  pool.active
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {pool.active ? '✅ Activo' : '❌ Finalizado'}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  selectedPool === pool.id
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-gray-300'
                }`}>
                  {selectedPool === pool.id ? '✓ Seleccionado' : 'Seleccionar'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario Unirse */}
      {selectedPool !== null && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Unirse a Pool #{selectedPool}</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Cantidad (NXT)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ingresa cantidad"
                className="flex-1 bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => setAmount(userData.tokenBalance)}
                className="bg-slate-700 hover:bg-slate-600 text-gray-300 px-4 py-3 rounded-lg transition"
              >
                Máx
              </button>
            </div>
          </div>

          <button
            onClick={handleJoinPool}
            disabled={loading || !amount}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || !amount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            }`}
          >
            {loading ? '⏳ Procesando...' : 'Unirse al Pool'}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/10 rounded-xl p-6 space-y-2">
        <h3 className="font-bold text-lg">💡 Sobre Pools de Recompensas</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>✅ Campañas de tiempo limitado</li>
          <li>✅ Recompensas distribuidas proporcionalmente</li>
          <li>✅ Puedes reclamar cuando finalice el pool</li>
          <li>✅ Sin comisiones</li>
        </ul>
      </div>
    </div>
  );
}
