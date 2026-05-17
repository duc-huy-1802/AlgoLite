import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
      <p className="text-white/30 text-sm font-mono">Loading...</p>
    </div>
  )
}
