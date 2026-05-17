// API Service for AWS API Gateway integration

// Mock data for development when API is not available
const mockQuestions = {
  questions: [
    {
      problem_id: "algo_two_sum_001",
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"],
      statement: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    },
    {
      problem_id: "algo_longest_substring_002",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["Hash Table", "String", "Sliding Window"],
      statement: "Given a string s, find the length of the longest substring without repeating characters.",
    },
    {
      problem_id: "algo_valid_parentheses_003",
      title: "Valid Parentheses",
      difficulty: "Easy",
      tags: ["Stack", "String"],
      statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    },
  ]
};

const mockProblemDetail = {
  problem_id: "algo_two_sum_001",
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Array", "Hash Table"],
  statement: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
  solution: "Use a hash map to store seen numbers and their indices. For each number, check if its complement exists in the map.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "nums[0] + nums[1] == 9, so we return [0, 1]."
    }
  ]
};

// GET /questions - Fetch all problems
export const fetchAllQuestions = async () => {
  try {
    const response = await fetch(`https://qdef1ddy45.execute-api.us-east-2.amazonaws.com/prod/questions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// GET /question/{problem_id} - Fetch a specific problem
export const fetchQuestion = async (problemId) => {
  try {
    const response = await fetch(`https://qdef1ddy45.execute-api.us-east-2.amazonaws.com/prod/questions/${problemId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API Error - Using mock data:', error.message);
    // Return mock data when API is unavailable
    return mockProblemDetail;
  }
};

// POST /solution/{problem_id} - Submit user solution
export const submitSolution = async (problemId, userSolution) => {
  try {
    const response = await fetch(
      `${API_URL}/solution/${problemId}?user_solution=${encodeURIComponent(userSolution)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API Error - Using mock response:`, error.message);
    // Return mock feedback when API is unavailable
    return {
      correct: Math.random() > 0.5,
      feedback: "Great approach! Consider optimizing for better time complexity.",
      execution_time: "0.5ms",
      memory_used: "2.4MB"
    };
  }
};

// POST /solution/{problem_id} - Get solution (user gave up)
export const getSolution = async (problemId) => {
  try {
    const response = await fetch(
      `${API_URL}/solution/${problemId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API Error - Using mock solution:`, error.message);
    // Return mock solution when API is unavailable
    return {
      solution: "Use a hash map to store seen numbers and their indices. For each number, check if its complement exists in the map. Time: O(n), Space: O(n)"
    };
  }
};

// POST /questions - Post new questions (for admin/scraping)
export const createQuestion = async (questionData) => {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};
