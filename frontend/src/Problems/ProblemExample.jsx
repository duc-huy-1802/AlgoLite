import React from 'react'

export default function ProblemExample({problem}) {
  return (
    <>
    <div className="mx-5 mt-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
        <p className="text-[11px] uppercase tracking-widest text-white/30 mb-3">Example:</p>
        <div className="flex flex-col gap-2 font-mono text-[13px] text-white/70">
          <div><span className="text-white/30 mr-2">Input</span>{problem.examples.input}</div>
          <div><span className="text-white/30 mr-2">Output</span>{problem.examples.output}</div>
          <div><span className="text-white/30 mr-2">Why</span>{problem.examples.explanation}</div>
        </div>
      </div>
      {/* divider */}
      <div className="h-px bg-white/[0.07] mx-5 mt-5" />
    </>
  )
}
