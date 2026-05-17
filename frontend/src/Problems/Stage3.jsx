import { useState } from "react";
import { STAGES } from "../pages/Problem";

export default function Stage3({ stage, handleSubmit, lastResponse, setStage}) {
  const [time,  setTime]  = useState("");
  const [space, setSpace] = useState("");
  return (
    <div className="px-5 mt-5">
      <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">
        Step {stage + 1} of {STAGES.length}
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

      <p className="text-[15px] font-medium leading-snug mb-5">
        What is the time and space complexity of your approach in big O notation?
      </p>

      {/* Time complexity */}
      <div className="mb-4 rounded-2xl border border-white/[0.4] bg-white/[0.02] p-4">
        <p className="text-[11px] uppercase tracking-widest text-white mb-2">
          Time complexity
        </p>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. n, n log n, n^2"
          className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-[14px] outline-none placeholder:text-white/20"
        />
      </div>

      {/* Space complexity */}
      <div className="mb-6 rounded-2xl border border-white/[0.4] bg-white/[0.02] p-4">
        <p className="text-[11px] uppercase tracking-widest text-white mb-2">
          Space complexity
        </p>
        <input
          id="space-input"
          type="text"
          value={space}
          onChange={(e) => setSpace(e.target.value)}
          placeholder="e.g. 1, n"
          className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-[14px] outline-none placeholder:text-white/20"
        />
      </div>
      {lastResponse && (
        <div className="flex items-start gap-2.5 bg-blue-500/[0.07] border border-white/10 rounded-2xl px-3.5 py-3 mt-4 mb-4">
            <p className="text-[12.5px] leading-[1.55] text-white/55">
              Your approach was: <span className="text-white/85 font-medium">{lastResponse}</span>
            </p>
          </div>
      )}

      <button
        onClick={() => handleSubmit(lastResponse, time, space)}
        disabled={!time.trim() || !space.trim()}
        className="w-full bg-blue-500 disabled:opacity-40 text-white rounded-2xl py-4 text-[15px] font-medium active:opacity-85"
      > Submit answer
      </button>
      <button
          onClick={() => setStage((s) => s + 1)}
          className="w-full mt-3 bg-amber-500 disabled:opacity-40 text-white rounded-2xl py-4 text-[15px] font-medium transition-opacity"
        >
          Next Step
        </button>


    </div>
  );
}