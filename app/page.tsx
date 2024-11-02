"use client"; // Important: this ensures the wallet SDK only runs on the client

import { useAuth } from "@crossmint/client-sdk-react-ui";

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


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-0 right-0 p-4">
        <AuthButton />
      </div>
      <div className="flex items-center justify-center w-full h-full">
      </div>
    </main>
  );
}

