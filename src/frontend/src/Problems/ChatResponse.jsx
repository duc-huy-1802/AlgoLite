import React from 'react'

export default function ChatResponse({chatResponse, time}) {
  return (
    <div className={`mx-5 mt-5 border rounded-2xl p-4 ${
          chatResponse.correct
            ? "bg-green-500/[0.05] border-green-500/20"
            : "bg-red-500/[0.05] border-red-500/20"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-[11px] uppercase tracking-widest ${
              chatResponse.correct ? "text-green-400" : "text-red-400"
            }`}>
              {chatResponse.correct ? "Correct" : "Not quite"}
            </p>
            <p className="text-[11px] text-white/30">continuing in {time}s</p>
          </div>
          <p className="text-[14px] text-white/70 leading-relaxed">
            {chatResponse.response}
          </p>
          {/* draining progress bar */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                chatResponse.correct ? "bg-green-400" : "bg-red-400"
              }`}
              style={{ width: `${(time / 3) * 100}%` }}
            />
          </div>
        </div>
  )
}
