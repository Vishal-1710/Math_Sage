import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Calculator, TrendingUp, Play, ArrowLeft } from 'lucide-react';
import ConceptExplorer from './components/ConceptExplorer';
import ProblemSolver from './components/ProblemSolver';
import GraphSimulator from './components/GraphSimulator';

type Topic = 'calculus-derivatives' | 'linear-algebra-matrices' | 'differential-equations' | 'probability-basics' | '';
type Difficulty = 'foundations' | 'core-concepts' | 'applied' | 'advanced' | 'pre-university' | 'engineering';
type SimulationType = 'concept' | 'problem' | 'application' | null;

function App() {
  const [currentSection, setCurrentSection] = useState<'home' | 'selection' | 'simulation'>('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('foundations');
  const [simulationType, setSimulationType] = useState<SimulationType>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Learn Through Simulation';
  }, []);

  const handleStartSimulation = () => {
    setCurrentSection('selection');
  };

  const handleTopicChange = (topic: Topic) => {
    setSelectedTopic(topic);
    setSimulationType(null);
    if (topic) {
      setCurrentSection('simulation');
    }
  };

  const handleSimulationTypeSelect = (type: SimulationType) => {
    setSimulationType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center space-x-4">
          <BookOpen className="w-12 h-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Learn Through Simulation</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Home Section */}
        {currentSection === 'home' && (
          <section className="text-center space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to Learn Through Simulation
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                We believe in <span className="font-semibold text-blue-600">interactive learning</span> to solve complex mathematical problems efficiently.
              </p>
              <p className="text-xl text-gray-600 mb-8">
                Our platform provides <span className="font-semibold text-blue-600">simulations</span> that help students grasp concepts effectively.
              </p>
              <button
                onClick={handleStartSimulation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <Play className="w-6 h-6" />
                <span>Start Simulation</span>
              </button>
            </div>
          </section>
        )}

        {/* Topic Selection */}
        {currentSection === 'selection' && (
          <section className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 border-blue-200 pb-4">
                Select Your Topic & Difficulty
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Choose a Topic:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => handleTopicChange(e.target.value as Topic)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="">-- Select a Topic --</option>
                    <option value="calculus-derivatives">Calculus - Derivatives</option>
                    <option value="linear-algebra-matrices">Linear Algebra - Matrices</option>
                    <option value="differential-equations">Differential Equations</option>
                    <option value="probability-basics">Probability - Basics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Select Difficulty Level:
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="foundations">Foundations</option>
                    <option value="core-concepts">Core Concepts</option>
                    <option value="applied">Applied Differentiation</option>
                    <option value="advanced">Advanced Calculus</option>
                    <option value="pre-university">Pre-University Mastery</option>
                    <option value="engineering">Engineering Mathematics</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setCurrentSection('home')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Simulation Section */}
        {currentSection === 'simulation' && selectedTopic && (
          <section className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Simulation Type:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSimulationTypeSelect('concept')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    simulationType === 'concept'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Concept Exploration</span>
                </button>
                <button
                  onClick={() => handleSimulationTypeSelect('problem')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    simulationType === 'problem'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Calculator className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Problem Solving</span>
                </button>
                <button
                  onClick={() => handleSimulationTypeSelect('application')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    simulationType === 'application'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Graph Simulation</span>
                </button>
              </div>
            </div>

            {/* Concept Exploration */}
            {simulationType === 'concept' && selectedTopic && (
              <ConceptExplorer 
                topic={selectedTopic} 
                difficulty={selectedDifficulty} 
                isLoading={isLoading}
              />
            )}

            {/* Problem Solving */}
            {simulationType === 'problem' && selectedTopic && (
              <ProblemSolver 
                topic={selectedTopic} 
                difficulty={selectedDifficulty}
              />
            )}

            {/* Graph Simulation */}
            {simulationType === 'application' && selectedTopic && (
              <GraphSimulator topic={selectedTopic} />
            )}

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => setCurrentSection('home')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Learn Through Simulation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;