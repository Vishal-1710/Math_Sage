import React, { useState } from 'react';
import { Calculator, CheckCircle, XCircle, Brain } from 'lucide-react';

interface ProblemSolverProps {
  topic: string;
  difficulty: string;
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({ topic, difficulty }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [customEquation, setCustomEquation] = useState('');
  const [customSolution, setCustomSolution] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getProblemData = (topic: string, difficulty: string) => {
    const problemDatabase = {
      'calculus-derivatives': {
        foundations: {
          problem: 'Find the derivative of f(x) = x² + 4x + 1',
          equation: 'x^2 + 4*x + 1',
          solution: '2*x + 4',
          hint: 'Use the power rule: d/dx[xⁿ] = nxⁿ⁻¹ and remember that the derivative of a constant is 0'
        },
        'core-concepts': {
          problem: 'Find the derivative of f(x) = 3x⁴ - 2x³ + 5x² - 7x + 2',
          equation: '3*x^4 - 2*x^3 + 5*x^2 - 7*x + 2',
          solution: '12*x^3 - 6*x^2 + 10*x - 7',
          hint: 'Apply the power rule to each term: d/dx[axⁿ] = a·n·xⁿ⁻¹'
        },
        applied: {
          problem: 'A particle moves with position s(t) = -4.9t² + 20t + 10 meters. Find the velocity function v(t).',
          equation: '-4.9*t^2 + 20*t + 10',
          solution: '-9.8*t + 20',
          hint: 'Velocity is the derivative of position: v(t) = s\'(t). This represents motion under gravity.'
        },
        advanced: {
          problem: 'Find dy/dx for the equation x² + y² = 16 using implicit differentiation',
          equation: 'x^2 + y^2 = 16',
          solution: 'dy/dx = -x/y',
          hint: 'Differentiate both sides with respect to x, treating y as a function of x. Remember: d/dx[y²] = 2y(dy/dx)'
        },
        'pre-university': {
          problem: 'Find the derivative of f(x) = (x² + 1)(x³ - 2x) using the product rule',
          equation: '(x^2 + 1)*(x^3 - 2*x)',
          solution: '5*x^4 - 4*x^2 + 3*x^2 - 2 = 5*x^4 - x^2 - 2',
          hint: 'Product rule: d/dx[uv] = u\'v + uv\'. Let u = x² + 1 and v = x³ - 2x'
        },
        engineering: {
          problem: 'In a circuit, charge Q(t) = 0.5t³ - 2t² + 4t coulombs. Find the current I(t) = dQ/dt.',
          equation: '0.5*t^3 - 2*t^2 + 4*t',
          solution: '1.5*t^2 - 4*t + 4',
          hint: 'Current is the rate of change of charge with respect to time: I(t) = dQ/dt'
        }
      },
      'linear-algebra-matrices': {
        foundations: {
          problem: 'Add the matrices A = [[1,2],[3,4]] and B = [[5,6],[7,8]]',
          equation: 'matrix_addition',
          solution: '[[6,8],[10,12]]',
          hint: 'Add corresponding elements: (A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ'
        }
      }
    };

    return problemDatabase[topic as keyof typeof problemDatabase]?.[difficulty as keyof typeof problemDatabase['calculus-derivatives']] || 
           problemDatabase['calculus-derivatives']['foundations'];
  };

  const calculateBasicDerivative = (equation: string): string => {
    try {
      // Enhanced derivative calculation with better pattern matching
      let expr = equation.toLowerCase().replace(/\s/g, '');
      
      // Handle special cases first
      if (expr.includes('=')) {
        // For implicit differentiation problems
        return 'Use implicit differentiation';
      }
      
      // Split into terms and process each
      const terms = expr.split(/(?=[+-])/).filter(term => term.length > 0 && term !== '+' && term !== '-');
      const derivatives = terms.map(term => {
        term = term.replace(/^\+/, ''); // Remove leading +
        
        // Constant term
        if (!term.includes('x') && !term.includes('t') && /^[+-]?\d+$/.test(term)) {
          return '0';
        }
        
        // Linear term (x or t)
        const linearMatch = term.match(/^([+-]?\d*)\*?([xt])$/);
        if (linearMatch) {
          const coeff = linearMatch[1] === '' ? '1' : linearMatch[1] === '-' ? '-1' : linearMatch[1] || '1';
          return coeff === '1' ? '1' : coeff === '-1' ? '-1' : coeff;
        }
        
        // Power term
        const powerMatch = term.match(/([+-]?\d*\.?\d*)\*?([xt])\^?(\*\*)?(\d+)/);
        if (powerMatch) {
          const coeff = powerMatch[1] === '' ? 1 : powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1]) || 1;
          const variable = powerMatch[2];
          const power = parseInt(powerMatch[4]) || 2;
          
          const newCoeff = coeff * power;
          const newPower = power - 1;
          
          if (newPower === 0) return newCoeff.toString();
          if (newPower === 1) return `${newCoeff}*${variable}`;
          return `${newCoeff}*${variable}^${newPower}`;
        }
        
        return '0';
      });
      
      let result = derivatives.filter(d => d !== '0').join(' + ')
        .replace(/\+ -/g, '- ')
        .replace(/\*\*/g, '^')
        .replace(/\*/g, '')
        .replace(/1([xt])/g, '$1'); // Remove coefficient of 1
        
      return result || '0';
    } catch (error) {
      return 'Error calculating derivative';
    }
  };

  const solveCustomProblem = async () => {
    if (!customEquation.trim()) {
      alert('Please enter an equation to solve.');
      return;
    }
    
    setIsLoading(true);
    setCustomSolution('');
    
    try {
      // Try Newton API first
      const response = await fetch(`https://newton.vercel.app/api/v2/derive/${encodeURIComponent(customEquation)}`);
      
      if (response.ok) {
        const data = await response.json();
        setCustomSolution(`Derivative: ${data.result}`);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      // Fallback to local calculation
      try {
        const derivative = calculateBasicDerivative(customEquation);
        setCustomSolution(`Derivative: ${derivative}`);
      } catch (error) {
        setCustomSolution('Error: Unable to solve this equation. Please check your input format.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter your answer.');
      return;
    }
    
    setIsLoading(true);
    setAnswerFeedback('');
    
    const problemData = getProblemData(topic, difficulty);
    
    try {
      // First try to use local calculation
      let correctAnswer = '';
      
      if (problemData.solution) {
        correctAnswer = problemData.solution;
      } else {
        // Try Newton API as fallback
        const response = await fetch(`https://newton.vercel.app/api/v2/derive/${encodeURIComponent(problemData.equation)}`);
        
        if (response.ok) {
          const data = await response.json();
          correctAnswer = data.result;
        } else {
          throw new Error('API request failed');
        }
      }
      
      // Normalize answers for comparison
      const normalizeAnswer = (answer: string) => {
        return answer.toLowerCase()
          .replace(/\s/g, '')
          .replace(/\*/g, '')
          .replace(/\^/g, '**')
          .replace(/(\d)([a-z])/g, '$1*$2');
      };
      
      const userAnswerNorm = normalizeAnswer(userAnswer);
      const correctAnswerNorm = normalizeAnswer(correctAnswer);
      
      if (userAnswerNorm === correctAnswerNorm) {
        setAnswerFeedback('✅ Correct! Excellent work!');
      } else {
        setAnswerFeedback(`❌ Not quite right. The correct answer is: ${correctAnswer}`);
      }
    } catch (error) {
      // Fallback verification
      const localAnswer = calculateBasicDerivative(problemData.equation);
      const userAnswerClean = userAnswer.replace(/\s/g, '').toLowerCase().replace(/\*/g, '');
      const localAnswerClean = localAnswer.replace(/\s/g, '').toLowerCase().replace(/\*/g, '');
      
      if (userAnswerClean === localAnswerClean) {
        setAnswerFeedback('✅ Correct! Well done!');
      } else {
        setAnswerFeedback(`❌ Not quite right. Expected: ${localAnswer}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const problemData = getProblemData(topic, difficulty);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calculator className="w-8 h-8 mr-3 text-blue-600" />
        Problem Solving - {topic.replace('-', ' ')}
      </h3>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Practice Problem ({difficulty}):
          </h4>
          <p className="text-blue-700 text-lg mb-3">{problemData.problem}</p>
          <div className="bg-blue-100 p-3 rounded text-sm text-blue-600">
            <strong>Hint:</strong> {problemData.hint}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Your Answer:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer (e.g., 3x^2 + 8x + 2)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
          
          <button
            onClick={checkAnswer}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Answer
              </>
            )}
          </button>
          
          {answerFeedback && (
            <div className={`p-4 rounded-lg border-l-4 ${
              answerFeedback.includes('✅') 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-center">
                {answerFeedback.includes('✅') ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                <p className="font-medium">{answerFeedback}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Or solve your own equation:</h4>
          <div className="space-y-4">
            <input
              type="text"
              value={customEquation}
              onChange={(e) => setCustomEquation(e.target.value)}
              placeholder="Enter function (e.g., x^3 + 2*x, 5*t^2 - 3*t)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={solveCustomProblem}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Solving...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Solve It
                </>
              )}
            </button>
            
            {customSolution && (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-lg font-medium text-gray-800">{customSolution}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;