import React, { useState } from 'react'
import { STAGES } from '../pages/Problem'

export default function Stage5({ stage, handleSubmit }) {
  const [input, setInput] = useState("");
  
  const currentStage = STAGES[stage - 1];

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

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={currentStage.placeholder}
        className="w-full bg-white/[0.04] border border-white/10 border-white/[0.4] rounded-2xl px-4 py-3.5 text-white text-[14px] leading-relaxed resize-none outline-none placeholder:text-white/25 transition-colors"
      />

      <button
        onClick={() => handleSubmit(input)}
        disabled={!input.trim()}
        className="w-full mt-3 bg-blue-500 disabled:opacity-40 text-white rounded-2xl py-4 text-[15px] font-medium transition-opacity"
      >
        Submit answer
      </button>

      <p className="text-center text-[12px] text-white/25 mt-3">
        Final reflection before submitting your solution
      </p>
    </div>
  )
}
