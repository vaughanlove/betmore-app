"use client";

import { EVMSmartWallet, useWallet } from "@crossmint/client-sdk-react-ui";
import { createClient } from "@supabase/supabase-js";
import { use, useEffect, useState } from "react";
import { abi } from "@/app/abi/usdc";
import { AuthButton } from "@/app/page";


interface ClaimVerification {
 id: number;
 created_at: string;
 result_boolean: boolean;
 result_explanation: string;
 result_source: string;
 claim_to_verify: string;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
 const [claim, setClaim] = useState("");
 const [balance, setBalance] = useState<bigint>(BigInt(0));
 const resolvedParams = use(params);

 const {wallet} = useWallet();

 const supabase = createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
 );

 
 useEffect(() => {
    async function getBalance(wallet: EVMSmartWallet | undefined) {

      const result = await wallet?.client.public.readContract({
        abi: abi,
        address: "0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F",
        functionName: "balanceOf",
        args: [wallet?.address],
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

 useEffect(() => {
   async function getBet() {
     const { data, error } = await supabase
       .from("markets")
       .select("*")
       .eq("uuid", resolvedParams.slug)
       .returns<ClaimVerification[]>();
     setClaim(data?.[0].claim_to_verify ?? "");
   }
   getBet();
 }, [resolvedParams.slug]);

 const handleBet = async (prediction: boolean) => {
   try {
    //  console.log(`Placing bet: ${prediction} on claim: ${claim}`);
    const {data, error} = await supabase.from('bets').insert({'amount' : 1000000, token: "0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F", side: prediction, wallet_address: wallet?.address, market_uuid: resolvedParams.slug})
    await bet(wallet, 1000000)
    } catch (error) {
     console.error("Error placing bet:", error);
   }
 };

 if (!claim) {
   return (
     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
     
     </div>
   );
 }

 return (
   <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
    <AuthButton />
     {wallet && (<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
       <div className="bg-gray-50 p-4 rounded-lg mb-6">
         <p>{claim}</p>
       </div>
       
       <div className="flex gap-4">
         <button
           onClick={() => handleBet(true)}
           className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium rounded-md"
         >
           True
         </button>
         <button
           onClick={() => handleBet(false)}
           className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium rounded-md"
         >
           False
         </button>
       </div>
     </div>)}
   </div>
 );
}