import React from 'react'

export default function ProblemCard({problem, problemDifficultyStyle}) {
  return (
    <div className="px-5 mt-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${problemDifficultyStyle}`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/40">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold leading-tight mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
          {problem.title}
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed">{problem.description}</p>
      </div>
  )
}
