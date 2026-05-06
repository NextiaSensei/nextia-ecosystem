'use client';

import { useWeb3 } from '@/context/Web3Context';
import { Wallet } from 'lucide-react';

export default function WalletConnect() {
  const { account, isConnected, loading, error, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
          <button
            onClick={disconnectWallet}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Wallet size={18} />
            {formatAddress(account)}
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition font-semibold"
        >
          <Wallet size={18} />
          {loading ? 'Conectando...' : 'Conectar Wallet'}
        </button>
      )}
    </div>
  );
}
