'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnect from './WalletConnect';
import { Coins } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/staking', label: 'Staking', icon: '📍' },
    { href: '/rewards', label: 'Rewards', icon: '🎁' },
    { href: '/governance', label: 'Governance', icon: '🗳️' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg group-hover:scale-105 transition">
              <Coins size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NextiaToken</h1>
              <p className="text-xs text-purple-300">DApp Ecosystem</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-1 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
