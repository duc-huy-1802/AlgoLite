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
import ChatResponse from "../Problems/ChatResponse";
import Stage2 from "../Problems/Stage2";
import Stage5 from "../Problems/Stage5";

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
    prompt: "Congratution to making it through the whole thing, good luck on your interview prep!!!!!!!!",
    placeholder: "",
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
  const [time, setTime] = useState(5);

  const [inputStage1, setInputStage1] = useState("");
  const [inputStage2, setInputStage2] = useState("");


  const currentStage = STAGES[stage - 1];

  useEffect(() => {
    if (!chatResponse.response) return;
    if (time === 0) {
      const prevResponse = chatResponse.correct
      if (prevResponse) {
        handleResetForNextStage()
      } else {
        handleIncorrect()
      }
    }
    const timer = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, chatResponse.correct, chatResponse.response]);
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
  const handleResetForNextStage = () => {
    setStage(s => s + 1)
    setChatResponse(s => ({
      correct: null,
      response: ""
    }))
    setTime(5)
  }
  const handleIncorrect = () => {
    // no stage 3
    if (stage == 1) {
      setInputStage1((s) => s);
    } else if (stage == 3) {
      setInputStage2((s) => s)
    }
    setChatResponse(s => ({
      correct: null,
      response: ""
    }))
    setTime(5)
  }
  const handleStage1Submit = async (userInput) => {
    try {
      setLoading(true)
      const response = await fetch(`https://qdef1ddy45.execute-api.us-east-2.amazonaws.com/prod/verify_patterns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_answer: userInput,
          problem_id: id
        })
      });
      const data = await response.json();
      const {feedback} = data;
      const correct = feedback.correct;
      const aiResponse = feedback.response;
      setChatResponse({
        correct: correct,
        response: aiResponse
      })
    } catch (error) {
      console.error(error)
      setError("Theres something with our system. Please come back later")
    } finally {
      setLoading(false)
    }
  }
  const handleStage2Submit = async (userInput) => {
    try {
      setLoading(true)
      const response = await fetch(`https://qdef1ddy45.execute-api.us-east-2.amazonaws.com/prod/verifyApproach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_answer: userInput,
          problem_id: id
        })
      });
      const data = await response.json();
      const { feedback } = data
      setChatResponse({
        correct: feedback.correct,
        response: feedback.response
      })
    } catch (error) {
      console.error(error)
      setError("Theres something with our system. Please come back later")
    } finally {
      setLoading(false)
    }
  }

  const handleStage3Submit = async (lastResponse, timeComplexity, spaceComplexity) => {
    try {
      setLoading(true)
      const response = await fetch(`https://qdef1ddy45.execute-api.us-east-2.amazonaws.com/prod/verify_bigO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_answer: {
            time_complexity: timeComplexity,
            space_complexity: spaceComplexity,
            approach: lastResponse
          },
          problem_id: id
        })
      });
      const data = await response.json();
      const {feedback} = data;
      const time_correct = feedback.time_correct;
      const space_correct = feedback.space_correct;
      const aiResponse = feedback.response
      setChatResponse({
        correct: time_correct && space_correct,
        response: aiResponse
      })
    } catch (error) {
      console.error(error)
      setError("Theres something with our system. Please come back later")
    } finally {
      setLoading(false)
    }
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
            <ChatResponse chatResponse={chatResponse} time={time} />
          ) : questionDisplay()}

        </div>
      );
    } else {
      return <Loading/>
    }
  }

  const questionDisplay = () => {
    if (currentStage.id == 1) { // might need to seperate stage 1 and stage 2 because we might use different prompting
      return (<Stage1 currentStage={currentStage} stage={stage} handleSubmit={handleStage1Submit} input={inputStage1} setInput={setInputStage1} setStage={setStage}/>);
    } else if (currentStage.id == 2) {
      return (<Stage2 currentStage={currentStage} stage={stage} handleSubmit={handleStage2Submit} input={inputStage2} setInput={setInputStage2} setStage={setStage}/>);
    } else if (currentStage.id == 3) {
      return (<Stage3 stage={stage} handleSubmit={handleStage3Submit} lastResponse={inputStage2} setStage={setStage}/>)
    } else if (currentStage.id == 4) {
      return (<Stage4 problem={problem} handleSubmit={handleStage4Submit} />)
    } else if (currentStage.id == 5) {
      return <Stage5 stage={stage}/>
    }
  }
  return display();
}