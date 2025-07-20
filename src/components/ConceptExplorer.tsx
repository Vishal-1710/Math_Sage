import React from 'react';
import { BookOpen, Lightbulb, Target } from 'lucide-react';

interface ConceptExplorerProps {
  topic: string;
  difficulty: string;
  isLoading: boolean;
}

interface ConceptNote {
  title: string;
  content: string;
  examples: string[];
  keyPoints: string[];
  formula?: string;
  applications?: string[];
}

const ConceptExplorer: React.FC<ConceptExplorerProps> = ({ topic, difficulty, isLoading }) => {
  const getConceptNotes = (topic: string, difficulty: string): ConceptNote => {
    // Comprehensive concept database for different topics and difficulty levels
    const conceptDatabase: Record<string, Record<string, ConceptNote>> = {
      'calculus-derivatives': {
        foundations: {
          title: 'Foundations of Derivatives',
          content: 'A derivative measures the instantaneous rate of change of a function. Think of it as the slope of the tangent line to the curve at any given point. This fundamental concept helps us understand how quantities change in relation to each other.',
          formula: 'f\'(x) = lim(h→0) [f(x+h) - f(x)]/h',
          examples: [
            'f(x) = x² → f\'(x) = 2x',
            'f(x) = 3x → f\'(x) = 3',
            'f(x) = x³ → f\'(x) = 3x²',
            'f(x) = 5 → f\'(x) = 0 (constant rule)'
          ],
          keyPoints: [
            'Derivative = instantaneous rate of change',
            'Geometrically represents slope of tangent line',
            'Foundation for understanding motion and change',
            'Constant functions have zero derivative'
          ],
          applications: [
            'Finding velocity from position',
            'Determining growth rates',
            'Analyzing function behavior'
          ]
        },
        'core-concepts': {
          title: 'Core Derivative Rules',
          content: 'Derivatives have systematic rules that make calculation efficient. The power rule, product rule, quotient rule, and chain rule form the foundation of differential calculus.',
          formula: 'Power Rule: d/dx[xⁿ] = nxⁿ⁻¹',
          examples: [
            'Power Rule: d/dx[x⁵] = 5x⁴',
            'Product Rule: d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x)',
            'Chain Rule: d/dx[sin(x²)] = cos(x²)·2x',
            'Quotient Rule: d/dx[x²/x³] = (2x·x³ - x²·3x²)/x⁶'
          ],
          keyPoints: [
            'Power rule applies to polynomial terms',
            'Product rule for products of functions',
            'Chain rule for composite functions',
            'Quotient rule for ratios of functions'
          ],
          applications: [
            'Solving complex polynomial derivatives',
            'Differentiating trigonometric functions',
            'Working with composite functions'
          ]
        },
        applied: {
          title: 'Applied Differentiation',
          content: 'Applied derivatives solve real-world problems involving rates of change, optimization, and related rates. They are essential for physics, engineering, and economics.',
          formula: 'Optimization: f\'(x) = 0 at critical points',
          examples: [
            'Position s(t) = 16t² → Velocity v(t) = 32t',
            'Profit P(x) = -x² + 100x → Max at P\'(x) = 0',
            'Related rates: dV/dt = 4πr²(dr/dt) for spheres',
            'Marginal cost: MC(x) = C\'(x)'
          ],
          keyPoints: [
            'Velocity is derivative of position',
            'Critical points found where f\'(x) = 0',
            'Related rates connect changing quantities',
            'Marginal analysis in economics'
          ],
          applications: [
            'Physics: motion analysis',
            'Economics: marginal analysis',
            'Engineering: optimization problems',
            'Biology: population growth rates'
          ]
        },
        advanced: {
          title: 'Advanced Calculus Techniques',
          content: 'Advanced techniques include implicit differentiation, higher-order derivatives, parametric equations, and multivariable calculus for complex mathematical modeling.',
          formula: 'Implicit: d/dx[F(x,y) = 0] using chain rule',
          examples: [
            'Implicit: x² + y² = 25 → 2x + 2y(dy/dx) = 0',
            'Second derivative: f\'\'(x) for concavity',
            'Parametric: x = t², y = t³ → dy/dx = (3t²)/(2t)',
            'Partial: ∂f/∂x for multivariable functions'
          ],
          keyPoints: [
            'Implicit differentiation for related variables',
            'Second derivatives reveal concavity',
            'Parametric differentiation uses chain rule',
            'Partial derivatives for multivariable functions'
          ],
          applications: [
            'Curve analysis and sketching',
            'Optimization in multiple variables',
            'Physics: related motion problems',
            'Engineering: system modeling'
          ]
        },
        'pre-university': {
          title: 'Pre-University Mastery',
          content: 'Comprehensive understanding of limits, continuity, differentiability, and advanced applications preparing for university-level mathematics and sciences.',
          formula: 'L\'Hôpital\'s Rule: lim[f(x)/g(x)] = lim[f\'(x)/g\'(x)]',
          examples: [
            'L\'Hôpital: lim(x→0)[sin(x)/x] = lim(x→0)[cos(x)/1] = 1',
            'Taylor series: eˣ = 1 + x + x²/2! + x³/3! + ...',
            'Mean Value Theorem applications',
            'Curve sketching with all derivative tests'
          ],
          keyPoints: [
            'L\'Hôpital\'s rule resolves indeterminate forms',
            'Taylor series approximate functions',
            'Mean Value Theorem guarantees',
            'Complete curve analysis techniques'
          ],
          applications: [
            'Advanced physics problems',
            'Mathematical modeling',
            'Preparation for university calculus',
            'Research and analysis methods'
          ]
        },
        engineering: {
          title: 'Engineering Mathematics',
          content: 'Engineering applications of derivatives in control systems, signal processing, optimization, and system analysis for real-world problem solving.',
          formula: 'PID Control: u(t) = Kp·e(t) + Ki∫e(t)dt + Kd·de(t)/dt',
          examples: [
            'Control systems: PID controllers use derivatives',
            'Signal processing: Fourier transform derivatives',
            'Optimization: minimize cost functions',
            'Heat transfer: temperature gradients'
          ],
          keyPoints: [
            'System stability analysis using derivatives',
            'Real-time control applications',
            'Optimization in design and manufacturing',
            'Signal analysis and filtering'
          ],
          applications: [
            'Robotics and automation',
            'Aerospace engineering',
            'Chemical process control',
            'Electrical circuit analysis'
          ]
        }
      },
      'linear-algebra-matrices': {
        foundations: {
          title: 'Matrix Fundamentals',
          content: 'Matrices are rectangular arrays of numbers that represent linear transformations and systems of equations. They are fundamental to linear algebra and have wide applications.',
          formula: 'A = [aᵢⱼ] where i = row, j = column',
          examples: [
            '2×2 Matrix: [[1,2],[3,4]]',
            'Identity Matrix: [[1,0],[0,1]]',
            'Zero Matrix: [[0,0],[0,0]]',
            'Matrix Addition: A + B = [aᵢⱼ + bᵢⱼ]'
          ],
          keyPoints: [
            'Matrices represent linear transformations',
            'Dimensions must match for addition',
            'Identity matrix is multiplicative identity',
            'Matrix operations follow specific rules'
          ],
          applications: [
            'Solving systems of equations',
            'Computer graphics transformations',
            'Data organization and analysis'
          ]
        }
      }
    };

    return conceptDatabase[topic]?.[difficulty] || conceptDatabase['calculus-derivatives']['foundations'];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading concept notes...</p>
        </div>
      </div>
    );
  }

  const conceptData = getConceptNotes(topic, difficulty);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
        Concept Exploration - {topic.replace('-', ' ')} ({difficulty})
      </h3>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-800 text-xl mb-3 flex items-center">
            <Target className="w-6 h-6 mr-2" />
            {conceptData.title}
          </h4>
          <p className="text-blue-700 text-lg leading-relaxed">{conceptData.content}</p>
        </div>
        
        {conceptData.formula && (
          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
            <h5 className="font-semibold text-yellow-800 mb-3">Key Formula:</h5>
            <code className="bg-white px-4 py-2 rounded text-lg font-mono text-yellow-700 block">
              {conceptData.formula}
            </code>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h5 className="font-semibold text-green-800 mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Key Examples:
            </h5>
            <ul className="space-y-2">
              {conceptData.examples.map((example, index) => (
                <li key={index} className="flex items-start text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <code className="bg-white px-2 py-1 rounded text-sm font-mono">{example}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h5 className="font-semibold text-purple-800 mb-3">Key Points to Remember:</h5>
            <ul className="space-y-2">
              {conceptData.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start text-purple-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {conceptData.applications && (
          <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
            <h5 className="font-semibold text-indigo-800 mb-3">Real-World Applications:</h5>
            <ul className="space-y-2">
              {conceptData.applications.map((application, index) => (
                <li key={index} className="flex items-start text-indigo-700">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{application}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptExplorer;