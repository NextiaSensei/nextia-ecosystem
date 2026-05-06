import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Web3Provider } from '@/context/Web3Context';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextiaToken DApp',
  description: 'Token ecosystem with Staking, Rewards, and Governance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white min-h-screen">
        <Web3Provider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
