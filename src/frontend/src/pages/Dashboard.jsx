import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: ["Linked List", "Math"],
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: ["Hash Table", "String", "Sliding Window"],
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: ["Array", "Binary Search", "Divide and Conquer"],
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: ["String", "Dynamic Programming"],
  },
];

const FILTERS = ["All", "Easy", "Medium", "Hard"];

const difficultyStyle = {
  Easy: "bg-green-500/10 text-green-400",
  Medium: "bg-orange-500/10 text-orange-400",
  Hard: "bg-red-500/10 text-red-400",
};

const difficultyDot = {
  Easy: "🟢",
  Medium: "🟠",
  Hard: "🔴",
};

export default function Dashboard() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const filtered =
    filter === "All"
      ? dummyData
      : dummyData.filter((p) => p.difficulty === filter);
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans pb-12">

      {/* top bar */}
      <div className="px-5 pt-6 mb-6">
        <span className="font-black text-xl tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Algo<span className="text-blue-400">Lite</span>
        </span>
        <h2 className="text-2xl font-bold mt-3" style={{ fontFamily: "Syne, sans-serif" }}>
          Problems
        </h2>
        <p className="text-white/40 text-sm mt-1">{dummyData.length} problems available</p>
      </div>

      {/* filter chips */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[12px] whitespace-nowrap border transition-all ${
              filter === f
                ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                : "border-white/10 text-white/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* problem list */}
      <div className="flex flex-col gap-2.5 px-5">
        {filtered.map((problem) => (
          <div
            key={problem.id}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3 active:bg-white/[0.06] transition-colors"
            onClick={() => navigate(`/problems/${problem.id}`)}
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0">
              {difficultyDot[problem.difficulty]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium truncate">{problem.title}</p>
              <p className="text-[12px] text-white/35 mt-0.5">
                {problem.category.join(" · ")}
              </p>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${difficultyStyle[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-white/30 text-sm mt-10">No problems found.</p>
        )}
      </div>
    </div>
  );
}