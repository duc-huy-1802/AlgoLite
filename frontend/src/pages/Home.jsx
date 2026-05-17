import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  function handleGetStarted() {
    const id = Math.floor(Math.random() * 20) + 1;
    navigate(`/problems/${id}`);
  }
  
  
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      
      {/* background grid */}
      <div className="absolute inset-0 bg-[url(/assets/background.webp)] bg-cover bg-center opacity-10" />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full">

        {/* badge */}
        <span className="text-xs text-blue-400 border border-blue-500/30 bg-blue-500/10 rounded-full px-4 py-1 uppercase tracking-widest">
          Welcome to {" "}
          <span className="text-white font-extrabold">AlgoLite</span>
        </span>

        {/* hero */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Learn Algorithms<br />
            <span className="text-blue-400">on the go</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto font-light">
            A platform for mastering algorithms and data structures — anytime, anywhere.
          </p>
        </div>

        {/* buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button className="w-full py-4 rounded-xl bg-blue-500 text-white font-medium text-base"
          onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="w-full py-4 rounded-xl border border-white/15 text-white/70 text-base"
          onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        </div>

      </div>

      <p className="text-white/20 text-xs relative z-10">AlgLite · Learn smarter, not harder</p>
    </div>
  )
}