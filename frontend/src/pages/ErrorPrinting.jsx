import React from 'react'
export default function ErrorPrinting({ message = "Something went wrong." }) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4 px-5">
      <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-lg">
        !
      </div>
      <p className="text-white text-[15px] font-medium">Oops</p>
      <p className="text-white/40 text-sm text-center">{message}</p>
    </div>
  );
}