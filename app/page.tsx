"use client"; // Important: this ensures the wallet SDK only runs on the client

import { EVMSmartWallet, useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { useEffect, useState } from "react";
import { abi } from "./abi/usdc";

function AuthButton() {
  const { login, logout, jwt } = useAuth();

  return (
    <div>
      {jwt == null ? (
        <button 
          type="button" 
          onClick={login} 
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      ) : (
        <button 
          type="button" 
          onClick={logout} 
          className="bg-black text-white font-bold py-2 px-4 rounded border-2 border-blue-500"
        >
          Logout
        </button>
      )}
    </div>
  );
}

const formatBalance = (balance: bigint) => {
  const raw = String(balance);
  const decimals = 6;
  
  if (raw.length <= decimals) {
    return `0.${raw.padStart(decimals, '0')}`;
  }
  
  const integerPart = raw.slice(0, -decimals);
  const decimalPart = raw.slice(-decimals);
  return `${integerPart}.${decimalPart}`;
};


export default function Home() {
    const { user } = useAuth();
  const { wallet } = useWallet();

  const [betNumber, setBetNumber] = useState('');
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  useEffect(() => {
    async function getBalance(wallet: EVMSmartWallet | undefined) {
      const result = await wallet?.client.public.readContract({
        abi: abi,
        address: "0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F",
        functionName: "balanceOf",
        args: ["0x2d9196E5dA3Db32b184B4a023948A0d475989483"],
      });

      if (result){
        setBalance(result);
      }
    }

    getBalance(wallet);
  }, [wallet]);

  async function bet(wallet: EVMSmartWallet | undefined, amount: number) {
    const result = wallet?.executeContract({
      abi: abi,
      address: "0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F",
      functionName: "transfer",
      args: ["0x2d9196E5dA3Db32b184B4a023948A0d475989483", BigInt(amount * 6)],
    });
  }

  return (
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
    <div className="container mx-auto px-4">
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-7xl font-bold text-white">
            BET<span className="text-blue-500">MORE</span>
          </h1>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>

          {wallet && (
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-800/50 p-6">
              <div className="text-xl text-gray-400">Your Balance</div>
              <div className="text-2xl font-bold text-white">
                {formatBalance(balance)} USDC
              </div>
              
            
            </div>
          )}
        </div>
      </div>
    </div>
  </div>  
  );
}

