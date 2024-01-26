import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/components/ui/use-toast';
import { WalletContextType } from 'types';
import { useRouter } from 'next/router';
import axiosInstance from '../src/axiosInstance';
import { useGlobalContext } from './GlobalContext';

// Create the context
const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

// Create a provider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [userAccounts, setAccounts] = useState<string[] | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasChangedAccount, sethasChangedAccount] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated } = useGlobalContext();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum as any);
          const accounts = await newProvider.listAccounts();
          console.log(accounts, 'accounts');
          let addressArray = [];
          if (accounts.length > 0) {
            addressArray = accounts.map((account) => account.address);
            setAccounts(addressArray);
            console.log(accounts, 'accounts');
            setAccount(accounts[0].address);
            localStorage.setItem('account', accounts[0].address);
            setIsConnected(true);

            setProvider(newProvider);
          }
        } catch (error) {
          console.error('An error occurred while connecting to the wallet:', error);
        }
      } else {
        console.error('MetaMask is not detected in the browser');
      }
    };

    init();
  }, []);

  interface EthereumWindow extends Window {
    ethereum?: {
      request: ({ method }: { method: string }) => Promise<void>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }

  useEffect(() => {
    const ethereumWindow = window as EthereumWindow;
    ethereumWindow.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      ethereumWindow.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [account]);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
      setIsAuthenticated(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      sethasChangedAccount(true);
      localStorage.setItem('account', accounts[0]);
      setIsAuthenticated(true);
    }
  };

  const connectToMetamask = async () => {
    if (!window.ethereum) {
      console.log('MetaMask not installed; using read-only defaults');
      toast({
        title: 'Error',
        description: 'You need to install Metamask, please try again',
        variant: 'destructive',
      });
      return;
    }
    if (isConnecting) {
      console.log('Already connecting to MetaMask, please wait.');
      return;
    }
    setIsConnecting(true);
    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum as any);
      const newSigner = await newProvider.getSigner();
      const newAccount = await newSigner.getAddress();
      const accounts = await newProvider.listAccounts();
      setAccounts(accounts.map((account) => account.address));
      setSigner(newSigner);
      setAccount(newAccount);
      setProvider(newProvider);
      setIsConnected(true);
      localStorage.setItem('account', newAccount);
      console.log('succes');
      localStorage.setItem('userAccount', newAccount as string);
      logInAccount(accounts.map((account) => account.address));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error connecting to MetaMask or generating signature:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const logInAccount = async (accounts: string[] | null) => {
    const { scheduleName, trackId, event_space_id, scheduleId } = router.query;
    let query: string = '';
    switch (router.pathname) {
      case '/dashboard/home':
        query = 'firstLogin=true';
        break;
      case '/dashboard/eventview/tracks/track/schedule':
        query = `scheduleName=${scheduleName}&trackId=${trackId}&event_space_id=${event_space_id}&scheduleId=${scheduleId}`;
        break;
      case '/dashboard/eventview/allschedules/schedule':
        query = `scheduleId=${scheduleId}&trackId=${trackId}&event_space_id=${event_space_id}`;
        break;
      default:
        query = ``;
        break;
    }

    try {
      const commitment = localStorage.getItem('commitment');
      await axiosInstance.post('/api/profile/walletSignIn', {
        accounts,
        commitment,
      });
      router.push({
        pathname: router.pathname,
        query: query,
      });
    } catch (error) {
      console.log(error, 'new error');
    }
  };

  // Provide the context
  return <WalletContext.Provider value={{ provider, signer, account, isConnected, connectToMetamask, hasChangedAccount, userAccounts }}>{children}</WalletContext.Provider>;
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
