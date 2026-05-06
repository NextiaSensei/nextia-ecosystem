'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  NEXTIA_TOKEN_ABI,
  STAKING_ABI,
  REWARDS_ABI,
  GOVERNANCE_ABI,
} from '@/lib/constants';

// Crear contexto
const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Contracts
  const [contracts, setContracts] = useState({
    token: null,
    staking: null,
    rewards: null,
    governance: null,
  });

  // User data
  const [userData, setUserData] = useState({
    tokenBalance: '0',
    stakedAmount: '0',
    pendingRewards: '0',
  });

  // Conectar wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      // Solicitar acceso a cuentas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Crear provider y signer
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      const network = await newProvider.getNetwork();

      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);

      // Inicializar contratos
      initializeContracts(newProvider, newSigner);

      // Cargar datos del usuario
      await loadUserData(newSigner);
    } catch (err) {
      setError(err.message);
      console.error('Error conectando wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setContracts({ token: null, staking: null, rewards: null, governance: null });
    setUserData({ tokenBalance: '0', stakedAmount: '0', pendingRewards: '0' });
  };

  // Inicializar contratos
  const initializeContracts = (prov, sig) => {
    try {
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NEXTIA_TOKEN,
        NEXTIA_TOKEN_ABI,
        sig || prov
      );

      const stakingContract = new ethers.Contract(
        CONTRACT_ADDRESSES.STAKING,
        STAKING_ABI,
        sig || prov
      );

      const rewardsContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REWARDS,
        REWARDS_ABI,
        sig || prov
      );

      const governanceContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GOVERNANCE,
        GOVERNANCE_ABI,
        sig || prov
      );

      setContracts({
        token: tokenContract,
        staking: stakingContract,
        rewards: rewardsContract,
        governance: governanceContract,
      });
    } catch (err) {
      console.error('Error inicializando contratos:', err);
    }
  };

  // Cargar datos del usuario
  const loadUserData = async (sig) => {
    try {
      const userAddr = await sig.getAddress();

      // Balance de token
      const balance = await contracts.token.balanceOf(userAddr);
      const balanceFormatted = ethers.formatEther(balance);

      // Staked amount
      const staked = await contracts.staking.getStakedAmount(userAddr);
      const stakedFormatted = ethers.formatEther(staked);

      // Pending rewards
      const rewards = await contracts.staking.getPendingRewards(userAddr);
      const rewardsFormatted = ethers.formatEther(rewards);

      setUserData({
        tokenBalance: balanceFormatted,
        stakedAmount: stakedFormatted,
        pendingRewards: rewardsFormatted,
      });
    } catch (err) {
      console.error('Error cargando datos del usuario:', err);
    }
  };

  // Escuchar cambios de red
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChange = async () => {
      if (isConnected) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const network = await newProvider.getNetwork();
        setProvider(newProvider);
        setSigner(newSigner);
        setChainId(network.chainId);
        initializeContracts(newProvider, newSigner);
      }
    };

    const handleAccountChange = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    window.ethereum.on('chainChanged', handleChainChange);
    window.ethereum.on('accountsChanged', handleAccountChange);

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChange);
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  }, [isConnected]);

  const value = {
    provider,
    signer,
    account,
    chainId,
    isConnected,
    loading,
    error,
    contracts,
    userData,
    connectWallet,
    disconnectWallet,
    loadUserData,
    initializeContracts,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Hook para usar el contexto
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 debe usarse dentro de Web3Provider');
  }
  return context;
}
