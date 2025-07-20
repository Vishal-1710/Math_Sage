import React, { useRef, useEffect, useState } from 'react';
import { TrendingUp, Info, Settings } from 'lucide-react';

interface GraphSimulatorProps {
  topic: string;
}

const GraphSimulator: React.FC<GraphSimulatorProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [equation, setEquation] = useState('x^2');
  const [showDerivative, setShowDerivative] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [xRange, setXRange] = useState(10);

  useEffect(() => {
    plotGraph();
  }, [equation, showDerivative, gridSize, xRange]);

  const evaluateFunction = (expr: string, x: number): number => {
    try {
      // Enhanced function evaluation with more mathematical functions
      let expression = expr.toLowerCase().replace(/\s/g, '');
      
      // Replace mathematical notation
      expression = expression.replace(/\^/g, '**');
      expression = expression.replace(/(\d)([a-z])/g, '$1*$2'); // 2x -> 2*x
      expression = expression.replace(/([a-z])(\d)/g, '$1*$2'); // x2 -> x*2
      expression = expression.replace(/\b([a-z])\b/g, `(${x})`); // Replace variables with value
      
      // Handle mathematical functions
      expression = expression.replace(/sin/g, 'Math.sin');
      expression = expression.replace(/cos/g, 'Math.cos');
      expression = expression.replace(/tan/g, 'Math.tan');
      expression = expression.replace(/log/g, 'Math.log');
      expression = expression.replace(/ln/g, 'Math.log');
      expression = expression.replace(/sqrt/g, 'Math.sqrt');
      expression = expression.replace(/abs/g, 'Math.abs');
      expression = expression.replace(/exp/g, 'Math.exp');
      
      // Evaluate safely
      const result = Function(`"use strict"; return (${expression})`)();
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };

  const calculateDerivative = (expr: string, x: number, h: number = 0.001): number => {
    const f1 = evaluateFunction(expr, x + h);
    const f2 = evaluateFunction(expr, x - h);
    return (f1 - f2) / (2 * h);
  };

  const plotGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up coordinate system
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = gridSize;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    
    for (let i = -xRange; i <= xRange; i++) {
      if (i !== 0) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvas.height);
        ctx.stroke();
      }
    }
    
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(canvas.width, centerY + i * scale);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    for (let i = -xRange; i <= xRange; i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX + i * scale, centerY + 15);
      }
    }
    
    ctx.textAlign = 'left';
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        ctx.fillText((-i).toString(), centerX + 5, centerY + i * scale + 3);
      }
    }

    // Plot original function
    if (equation) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      for (let x = -xRange; x <= xRange; x += 0.05) {
        const y = evaluateFunction(equation, x);
        
        if (!isNaN(y)) {
          const canvasX = centerX + x * scale;
          const canvasY = centerY - y * scale;
          
          if (canvasY >= -50 && canvasY <= canvas.height + 50) {
            if (firstPoint) {
              ctx.moveTo(canvasX, canvasY);
              firstPoint = false;
            } else {
              ctx.lineTo(canvasX, canvasY);
            }
          } else {
            firstPoint = true;
          }
        } else {
          firstPoint = true;
        }
      }
      ctx.stroke();
    }

    // Plot derivative if enabled
    if (showDerivative && equation) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      let firstPoint = true;
      for (let x = -xRange; x <= xRange; x += 0.05) {
        const y = calculateDerivative(equation, x);
        
        if (!isNaN(y) && isFinite(y)) {
          const canvasX = centerX + x * scale;
          const canvasY = centerY - y * scale;
          
          if (canvasY >= -50 && canvasY <= canvas.height + 50) {
            if (firstPoint) {
              ctx.moveTo(canvasX, canvasY);
              firstPoint = false;
            } else {
              ctx.lineTo(canvasX, canvasY);
            }
          } else {
            firstPoint = true;
          }
        } else {
          firstPoint = true;
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Add legend
    if (equation) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 10, 200, showDerivative ? 60 : 35);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 200, showDerivative ? 60 : 35);
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(15, 20, 20, 3);
      ctx.fillStyle = '#374151';
      ctx.font = '14px sans-serif';
      ctx.fillText(`f(x) = ${equation}`, 40, 25);
      
      if (showDerivative) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(15, 45);
        ctx.lineTo(35, 45);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#374151';
        ctx.fillText(`f'(x) (derivative)`, 40, 50);
      }
    }
  };

  const presetFunctions = [
    { name: 'Quadratic', equation: 'x^2' },
    { name: 'Cubic', equation: 'x^3' },
    { name: 'Sine Wave', equation: 'sin(x)' },
    { name: 'Exponential', equation: 'exp(x/2)' },
    { name: 'Polynomial', equation: 'x^3 - 3*x^2 + 2*x' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
        Interactive Graph Simulation
      </h3>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-2 border-gray-300 rounded-lg w-full bg-white shadow-inner"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Function:
            </label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="Enter function (e.g., x^2 + 3*x)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Presets:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {presetFunctions.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setEquation(preset.equation)}
                  className="text-left p-2 bg-gray-50 hover:bg-blue-50 rounded border transition-colors duration-200"
                >
                  <span className="font-medium text-blue-600">{preset.name}</span>
                  <br />
                  <code className="text-sm text-gray-600">{preset.equation}</code>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Options:</h4>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDerivative}
                onChange={(e) => setShowDerivative(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Show Derivative</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grid Size: {gridSize}px
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X Range: ±{xRange}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={xRange}
                onChange={(e) => setXRange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Supported Functions:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Polynomials: x^2, x^3, 2*x^2 + 3*x</li>
              <li>• Trigonometric: sin(x), cos(x), tan(x)</li>
              <li>• Exponential: exp(x), log(x)</li>
              <li>• Other: sqrt(x), abs(x)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphSimulator;