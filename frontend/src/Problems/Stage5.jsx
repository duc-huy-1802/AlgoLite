import React, { useState } from 'react'
import { STAGES } from '../pages/Problem'
import { useNavigate } from 'react-router-dom';

export default function Stage5({stage}) {
  
  const currentStage = STAGES[stage - 1];
  const navigate = useNavigate();

  return (
    <div className="px-5 mt-5">
      <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">
        Step {stage} of {STAGES.length}
      </p>

      {/* progress dots */}
      <div className="flex gap-1.5 mb-4">
        {STAGES.map((s) => (
          <div
            key={s.id}
            className={`h-1 rounded-full flex-1 transition-all ${
              s.id < stage
                ? "bg-blue-500"
                : s.id === stage
                ? "bg-blue-500/50"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <p className="text-[15px] font-medium leading-snug mb-4">
        {currentStage.prompt}
      </p>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-3 bg-blue-500 disabled:opacity-40 text-white rounded-2xl py-4 text-[15px] font-medium transition-opacity"
      >
        Return back to Home
      </button>

      <p className="text-center text-[12px] text-white/25 mt-3">
        Final reflection before submitting your solution
      </p>
    </div>
  )
}
