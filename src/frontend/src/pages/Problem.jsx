import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemTopBar from "../Problems/ProblemTopBar";
import ProblemCard from "../Problems/ProblemCard";
import ProblemExample from  "../Problems/ProblemExample";
import Stage1 from "../Problems/Stage1";

const dummyData = {
  id: 1,
  title: "Two Sum",
  description:
    "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
  difficulty: "Easy",
  tags: ["Array", "Hash Table"],
  examples: {
    input: "[2, 7, 11, 15], target = 9",
    output: "[0, 1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
  },
};

export const STAGES = [
  {
    id: 0,
    label: "Pattern",
    prompt: "What pattern or technique does this problem remind you of?",
    placeholder: "e.g. I think this is a hash map problem because...",
  },
  {
    id: 1,
    label: "Approach",
    prompt: "Describe your approach to solving this — plain English or pseudocode.",
    placeholder: "e.g. I would iterate through the array and for each number...",
  },
  {
    id: 2,
    label: "Complexity",
    prompt: "What is the time and space complexity of your approach?",
    placeholder: "e.g. Time: O(n) because... Space: O(n) because...",
  },
  {
    id: 3,
    label: "Verify",
    prompt: "Walk through your solution with the example input. Does it produce the correct output?",
    placeholder: "e.g. Starting with nums=[2,7,11,15], target=9...",
  },
  {
    id: 4,
    label: "Reflect",
    prompt: "Could you improve your solution further? Any edge cases to consider?",
    placeholder: "e.g. Edge cases: empty array, no valid pair, duplicate values...",
  },
];

const difficultyStyle = {
  Easy: "bg-green-500/10 text-green-400",
  Medium: "bg-orange-500/10 text-orange-400",
  Hard: "bg-red-500/10 text-red-400",
};

export default function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = dummyData;

  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const [chatResponse, setChatResponse] = useState({ correct: null, response: "" });
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(3);

  const currentStage = STAGES[stage];
  const isLast = stage === STAGES.length - 1;

  useEffect(() => {
    if (!chatResponse.response) return;
    if (time === 0) {
      const prevResponse = chatResponse.correct
      setChatResponse({ correct: null, response: "" });
      setTime(5);
      if (prevResponse) {
        handleResetForNextStage()
        
      }
    }
    const timer = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, chatResponse]);
  const handleResetForNextStage = () => {
    setStage(s => s + 1)
    setInput("")
    setChatResponse(s => ({
      correct: null,
      response: ""
    }))
    setTime(3)

  }

  const handleStage = async (stageId, userInput) => {
    // swap each with real API call
    // expected return: { correct: bool, response: string }
    switch (stageId) {
      case 0: return null; // pattern — no evaluation, just advance
      case 1: return null; // approach — call backend
      case 2: return null; // complexity — call backend
      case 3: return null; // verify — call backend
      case 4: return null; // reflect — call backend
      default: return null;
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await handleStage(stage, input);
      if (response) {
        setChatResponse(response);
        setTime(5);
      } else {
        if (!isLast) setStage((s) => s + 1);
      }
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const questionDisplay = () => {
    if (currentStage.id == 0) {
      return (<Stage1
          currentStage={currentStage}
          isLast={isLast}
          stage={stage}
          input={input}
          setInput={setInput}
          loading={loading}
          handleSubmit={handleSubmit}
        />);
    }

  }
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans pb-12">

      <ProblemTopBar />
      <ProblemCard
        problem={problem}
        problemDifficultyStyle={difficultyStyle[problem.difficulty]}
      />
      <ProblemExample problem={problem} />

      {chatResponse.response ? (
        <ChatFeedback chatResponse={chatResponse} time={time} />
      ) : questionDisplay()}

    </div>
  );
}