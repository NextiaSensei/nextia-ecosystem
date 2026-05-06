'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Vote, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ethers } from 'ethers';

export default function GovernancePage() {
  const { isConnected, userData, contracts } = useWeb3();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [expandedProposal, setExpandedProposal] = useState(null);

  useEffect(() => {
    if (isConnected && contracts.governance) {
      loadProposals();
    }
  }, [isConnected, contracts.governance]);

  const loadProposals = async () => {
    try {
      const count = await contracts.governance.proposalCount();
      const proposalList = [];

      for (let i = 0; i < count; i++) {
        const proposalInfo = await contracts.governance.getProposalInfo(i);
        proposalList.push({
          id: i,
          proposer: proposalInfo.proposer,
          title: proposalInfo.title,
          startBlock: proposalInfo.startBlock.toString(),
          endBlock: proposalInfo.endBlock.toString(),
          forVotes: ethers.formatEther(proposalInfo.forVotes),
          againstVotes: ethers.formatEther(proposalInfo.againstVotes),
          executed: proposalInfo.executed,
        });
      }

      setProposals(proposalList.reverse());
    } catch (err) {
      console.error('Error cargando propuestas:', err);
    }
  };

  const handlePropose = async () => {
    try {
      setLoading(true);

      if (!title.trim()) {
        alert('Ingresa una propuesta');
        return;
      }

      if (parseFloat(userData.tokenBalance) < 1000) {
        alert('❌ Necesitas 1,000+ NXT para proponer');
        return;
      }

      const proposeTx = await contracts.governance.proposeGovernanceChange(title);
      await proposeTx.wait();

      alert('✅ Propuesta creada!');
      setTitle('');
      await loadProposals();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId, support) => {
    try {
      setLoading(true);

      const voteTx = await contracts.governance.castVote(proposalId, support);
      await voteTx.wait();

      alert(`✅ Voto ${support === 1 ? 'a favor' : 'en contra'} registrado!`);
      await loadProposals();
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
        <Vote size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Conecta tu Wallet</h2>
        <p className="text-gray-400">Necesitas conectar MetaMask para participar en gobernanza</p>
      </div>
    );
  }

  const canPropose = parseFloat(userData.tokenBalance) >= 1000;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
          🗳️ Gobernanza
        </h1>
        <p className="text-gray-400">Vota y propón cambios en el protocolo</p>
      </div>

      {/* Tu Poder de Voto */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Balance NXT</p>
            <p className="text-3xl font-bold text-orange-400">{parseFloat(userData.tokenBalance).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Poder de Voto</p>
            <p className="text-3xl font-bold text-yellow-400">{(parseFloat(userData.tokenBalance) / 1).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Puedo Proponer</p>
            <p className="text-3xl font-bold">{canPropose ? '✅' : '❌'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Mínimo Requerido</p>
            <p className="text-3xl font-bold text-purple-400">1K</p>
          </div>
        </div>
      </div>

      {/* Nueva Propuesta */}
      {canPropose && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Crear Nueva Propuesta</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Descripción de la Propuesta</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ejemplo: Aumentar APY de staking a 25%..."
              className="w-full bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handlePropose}
            disabled={loading || !title.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || !title.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
            }`}
          >
            {loading ? '⏳ Creando...' : '📝 Crear Propuesta'}
          </button>
        </div>
      )}

      {!canPropose && (
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6 text-center">
          <p className="text-orange-300">⚠️ Necesitas 1,000+ NXT para crear propuestas</p>
          <p className="text-gray-400 text-sm mt-2">
            Balance actual: {parseFloat(userData.tokenBalance).toFixed(2)} / 1,000 NXT
          </p>
        </div>
      )}

      {/* Propuestas */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Propuestas ({proposals.length})</h2>

        {proposals.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-8 text-center">
            <p className="text-gray-400">No hay propuestas en este momento</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                  <p className="text-xs text-gray-500">
                    Propuesto por: {proposal.proposer.substring(0, 10)}...
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  proposal.executed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {proposal.executed ? '✅ Ejecutada' : '🔄 Votando'}
                </span>
              </div>

              {/* Votos */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp size={18} className="text-green-400" />
                    <p className="text-gray-400 text-sm">A Favor</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{parseFloat(proposal.forVotes).toFixed(0)}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown size={18} className="text-red-400" />
                    <p className="text-gray-400 text-sm">En Contra</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">{parseFloat(proposal.againstVotes).toFixed(0)}</p>
                </div>
              </div>

              {/* Botones de Voto */}
              {!proposal.executed && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVote(proposal.id, 1)}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg transition font-semibold"
                  >
                    <ThumbsUp size={18} className="inline mr-2" />
                    Votar a Favor
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 0)}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 text-white py-2 rounded-lg transition font-semibold"
                  >
                    <ThumbsDown size={18} className="inline mr-2" />
                    Votar en Contra
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/10 rounded-xl p-6 space-y-2">
        <h3 className="font-bold text-lg">💡 Sobre Gobernanza</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>✅ Necesitas 1,000+ NXT para proponer</li>
          <li>✅ 1 token = 1 voto</li>
          <li>✅ Período de votación: ~1 semana</li>
          <li>✅ Las decisiones son inmutables en blockchain</li>
        </ul>
      </div>
    </div>
  );
}
