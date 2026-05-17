import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemTopBar from "../Problems/ProblemTopBar";
import ProblemCard from "../Problems/ProblemCard";
import ProblemExample from  "../Problems/ProblemExample";
import Stage1 from "../Problems/Stage1";
import Stage3  from "../Problems/Stage3";
import Stage4 from "../Problems/Stage4";
import { fetchQuestion } from "../services/api";
import Loading from "./Loading";
import ErrorPrinting from "./ErrorPrinting";

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

  const [stage, setStage] = useState(1);

  const [chatResponse, setChatResponse] = useState({ correct: null, response: "" });
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const [time, setTime] = useState(3);


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
  useEffect(() => {
      const loadProblems = async () => {
        try {
          setLoading(true);
          const data = await fetchQuestion(id);
          setProblem(data.question)
        } catch (err) {
          setError(err.message);
          console.error('Failed to load problems:', err);
        } finally {
          setLoading(false);
        }
      };
  
      loadProblems();
    }, []);
  const handleStage1Submit = (userInput) => {
    setStage((s) => s + 1)
  }
  const handleStage3Submit = (timeComplexity, spaceComplexity) => {
    setStage((s) => s + 1)
  }
  const handleStage4Submit = () => {
    setStage((s) => s + 1)
  }

  const display = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <ErrorPrinting error={error}/>
    } else if (problem) {
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
    } else {
      return <Loading/>
    }
  }

  const questionDisplay = () => {
    if (currentStage.id == 1 || currentStage.id == 2) { // might need to seperate stage 1 and stage 2 because we might use different prompting
      return (<Stage1 currentStage={currentStage} stage={stage} handleSubmit={handleStage1Submit}/>);
    } else if (currentStage.id == 3) {
      return (<Stage3 stage={stage} handleSubmit={handleStage3Submit}/>)
    } else if (currentStage.id == 4) {
      return (<Stage4 problem={problem} handleSubmit={handleStage4Submit} />)
    }
  }
  return display();
}