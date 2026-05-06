'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Lock, Plus, Minus } from 'lucide-react';

export default function StakingPage() {
  const { isConnected, userData, contracts, signer } = useWeb3();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('deposit'); // deposit or withdraw

  const handleStake = async () => {
    try {
      setLoading(true);

      if (!amount || parseFloat(amount) <= 0) {
        alert('Ingresa un monto válido');
        return;
      }

      if (!contracts.token || !contracts.staking) {
        alert('Contratos no inicializados');
        return;
      }

      const amountWei = ethers.parseEther(amount);

      if (action === 'deposit') {
        // Primero aprobar el token
        const approveTx = await contracts.token.approve(
          CONTRACT_ADDRESSES.STAKING,
          amountWei
        );
        await approveTx.wait();

        // Luego depositar
        const depositTx = await contracts.staking.deposit(amountWei);
        await depositTx.wait();

        alert('✅ Deposito exitoso!');
      } else {
        // Withdraw
        const withdrawTx = await contracts.staking.withdraw(amountWei);
        await withdrawTx.wait();
        alert('✅ Retiro exitoso!');
      }

      setAmount('');
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);

      if (!contracts.staking) {
        alert('Contrato no inicializado');
        return;
      }

      const claimTx = await contracts.staking.claimRewards();
      await claimTx.wait();

      alert('✅ Recompensas reclamadas!');
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
        <Lock size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Conecta tu Wallet</h2>
        <p className="text-gray-400">Necesitas conectar MetaMask para usar Staking</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          📍 Staking
        </h1>
        <p className="text-gray-400">Gana ~20% APY en tus tokens NXT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tu Balance */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Balance Disponible</p>
          <p className="text-3xl font-bold text-blue-400">{parseFloat(userData.tokenBalance).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">NXT</p>
        </div>

        {/* Cantidad Stakeada */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Staking</p>
          <p className="text-3xl font-bold text-purple-400">{parseFloat(userData.stakedAmount).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">NXT</p>
        </div>

        {/* Recompensas Pendientes */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Recompensas Pendientes</p>
          <p className="text-3xl font-bold text-green-400">{parseFloat(userData.pendingRewards).toFixed(4)}</p>
          <p className="text-xs text-gray-500 mt-2">NXT</p>
        </div>
      </div>

      {/* Formulario de Staking */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Gestionar Staking</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAction('deposit')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              action === 'deposit'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Plus size={18} className="inline mr-2" />
            Depositar
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              action === 'withdraw'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Minus size={18} className="inline mr-2" />
            Retirar
          </button>
        </div>

        {/* Input */}
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

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleStake}
            disabled={loading || !amount}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              loading || !amount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : action === 'deposit'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
            }`}
          >
            {loading ? '⏳ Procesando...' : action === 'deposit' ? 'Depositar' : 'Retirar'}
          </button>
          <button
            onClick={handleClaimRewards}
            disabled={loading || parseFloat(userData.pendingRewards) === 0}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              loading || parseFloat(userData.pendingRewards) === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {loading ? '⏳ Procesando...' : 'Reclamar Rewards'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/10 rounded-xl p-6 space-y-2">
        <h3 className="font-bold text-lg">💡 Información de Staking</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>✅ APY: ~20% anual</li>
          <li>✅ Rewards por segundo</li>
          <li>✅ Sin penalización por retiro</li>
          <li>✅ Retira cuando quieras</li>
        </ul>
      </div>
    </div>
  );
}
