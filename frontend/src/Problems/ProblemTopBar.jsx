import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProblemTopBar() {
    const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-5 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-lg"
        >
          ←
        </button>
        <span className="font-black text-lg tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Algo<span className="text-blue-400">Lite</span>
        </span>
      </div>
  )
}
