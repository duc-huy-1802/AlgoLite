import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestion, submitSolution, getSolution } from "../services/api";
import ProblemTopBar from "../Problems/ProblemTopBar";
import ProblemCard from "../Problems/ProblemCard";
import ProblemExample from  "../Problems/ProblemExample";
import ChatResponse from "../Problems/ChatResponse";
import Stage1 from "../Problems/Stage1";
import Stage3  from "../Problems/Stage3";
import Stage4 from "../Problems/Stage4";
import Stage5 from "../Problems/Stage5";

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
    id: 1,
    label: "Pattern",
    prompt: "What pattern or technique does this problem remind you of?",
    placeholder: "e.g. I think this is a hash map problem because...",
  },
  {
    id: 2,
    label: "Approach",
    prompt: "Describe your approach to solving this — plain English.",
    placeholder: "e.g. I would iterate through the array and for each number...",
  },
  {
    id: 3,
    label: "Complexity",
    prompt: "What is the time and space complexity of your approach?",
    placeholder: "e.g. Time: O(n) because... Space: O(n) because...",
  },
  {
    id: 4,
    label: "Verify",
    prompt: "Walk through your solution with the example input. Does it produce the correct output?",
    placeholder: "e.g. Starting with nums=[2,7,11,15], target=9...",
  },
  {
    id: 5,
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
  
  // Data states
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(true);
  const [problemError, setProblemError] = useState(null);

  // Stage states
  const [stage, setStage] = useState(1);
  const [chatResponse, setChatResponse] = useState({ correct: null, response: "" });
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(3);
  const [input, setInput] = useState("");

  // Fetch problem on mount
  useEffect(() => {
    const loadProblem = async () => {
      try {
        setProblemLoading(true);
        const data = await fetchQuestion(id);
        // Map API response to component's expected format
        const mappedProblem = {
          id: data.problem_id,
          title: data.title,
          description: data.statement,
          difficulty: data.difficulty,
          tags: data.tags,
          examples: {
            input: data.examples?.[0]?.input || "",
            output: data.examples?.[0]?.output || "",
            explanation: data.examples?.[0]?.explanation || "",
          },
        };
        setProblem(mappedProblem);
      } catch (err) {
        setProblemError(err.message);
        console.error('Failed to load problem:', err);
      } finally {
        setProblemLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  const currentStage = STAGES[stage - 1];

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

  const handleStage1Submit = async (userInput) => {
    setInput(userInput);
    setStage((s) => s + 1);
  }

  const handleStage3Submit = async (timeComplexity, spaceComplexity) => {
    setStage((s) => s + 1);
  }

  const handleStage4Submit = async () => {
    // When stage 4 (Verify) is submitted, prepare solution submission
    setStage((s) => s + 1);
  }

  // Submit final solution to API when all stages are complete
  const handleFinalSubmit = async () => {
    if (!problem || !input) return;
    
    try {
      setLoading(true);
      const response = await submitSolution(problem.id, input);
      
      // Handle API response
      setChatResponse({
        correct: response.correct || response.success,
        response: response.feedback || response.message || "Solution submitted!",
      });
    } catch (err) {
      setChatResponse({
        correct: false,
        response: `Error submitting solution: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  // Get solution when user gives up
  const handleGetSolution = async () => {
    if (!problem) return;
    
    try {
      setLoading(true);
      const response = await getSolution(problem.id);
      
      setChatResponse({
        correct: null,
        response: `Solution: ${response.solution || "No solution available"}`,
      });
    } catch (err) {
      setChatResponse({
        correct: false,
        response: `Error getting solution: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  const questionDisplay = () => {
    if (currentStage.id == 1 || currentStage.id == 2) {
      return (<Stage1 currentStage={currentStage} stage={stage} handleSubmit={handleStage1Submit}/>);
    } else if (currentStage.id == 3) {
      return (<Stage3 stage={stage} handleSubmit={handleStage3Submit}/>)
    } else if (currentStage.id == 4) {
      return (<Stage4 problem={problem} handleSubmit={handleStage4Submit} />)
    } else if (currentStage.id == 5) {
      return (<Stage5 stage={stage} />)
    }
    return null;
  }
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans pb-12">
      {problemLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/40">Loading problem...</p>
        </div>
      )}
      
      {problemError && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-400">Error: {problemError}</p>
        </div>
      )}
      
      {!problemLoading && !problemError && problem && (
        <>
          <ProblemTopBar />
          <ProblemCard
            problem={problem}
            problemDifficultyStyle={difficultyStyle[problem.difficulty]}
          />
          <ProblemExample problem={problem} />

          {chatResponse.response ? (
            <ChatResponse chatResponse={chatResponse} time={time} />
          ) : questionDisplay()}
        </>
      )}
    </div>
  );
}