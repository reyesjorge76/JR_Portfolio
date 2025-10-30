import React, { useState, useEffect } from 'react';

interface BatteryMixingSystemProps {
  isRunning: boolean;
  parameters: {
    speed: number;
    temperature: number;
    pressure: number;
    recipe: string;
  };
}

const BatteryMixingSystem: React.FC<BatteryMixingSystemProps> = ({ isRunning, parameters }) => {
  const [tank1Level, setTank1Level] = useState(85);
  const [tank2Level, setTank2Level] = useState(75);
  const [mixerLevel, setMixerLevel] = useState(30);
  const [qualityTankLevel, setQualityTankLevel] = useState(20);
  const [mixerRotation, setMixerRotation] = useState(0);
  const [flow1Active, setFlow1Active] = useState(false);
  const [flow2Active, setFlow2Active] = useState(false);
  const [flowToQuality, setFlowToQuality] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Simulate material flow
        if (tank1Level > 20 && mixerLevel < 80) {
          setTank1Level(prev => Math.max(20, prev - 0.5));
          setFlow1Active(true);
        } else {
          setFlow1Active(false);
        }

        if (tank2Level > 20 && mixerLevel < 80) {
          setTank2Level(prev => Math.max(20, prev - 0.3));
          setFlow2Active(true);
        } else {
          setFlow2Active(false);
        }

        if (flow1Active || flow2Active) {
          setMixerLevel(prev => Math.min(80, prev + 0.8));
        }

        // Transfer to quality tank
        if (mixerLevel > 60 && qualityTankLevel < 90) {
          setMixerLevel(prev => Math.max(20, prev - 0.4));
          setQualityTankLevel(prev => Math.min(90, prev + 0.4));
          setFlowToQuality(true);
        } else {
          setFlowToQuality(false);
        }

        // Mixer rotation
        setMixerRotation(prev => (prev + parameters.speed / 10) % 360);

        // Refill supply tanks
        if (tank1Level < 30) setTank1Level(prev => Math.min(85, prev + 1));
        if (tank2Level < 30) setTank2Level(prev => Math.min(75, prev + 1));
        if (qualityTankLevel > 80) setQualityTankLevel(20);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning, parameters.speed, flow1Active, flow2Active, mixerLevel, qualityTankLevel, tank1Level, tank2Level]);

  return (
    <div className="relative h-96 bg-gray-900/50 rounded-lg p-4">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Supply Tank 1 */}
        <g transform="translate(100, 50)">
          <rect x="0" y="0" width="100" height="150" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <rect 
            x="5" 
            y={150 - (tank1Level * 1.4)} 
            width="90" 
            height={tank1Level * 1.4} 
            fill="#06b6d4" 
            opacity="0.3"
          />
          <text x="50" y="-10" textAnchor="middle" fill="#06b6d4" fontSize="14">Raw Material A</text>
          <text x="50" y="170" textAnchor="middle" fill="#9ca3af" fontSize="12">{tank1Level.toFixed(0)}%</text>
        </g>

        {/* Supply Tank 2 */}
        <g transform="translate(250, 50)">
          <rect x="0" y="0" width="100" height="150" fill="none" stroke="#a855f7" strokeWidth="2" rx="5" />
          <rect 
            x="5" 
            y={150 - (tank2Level * 1.4)} 
            width="90" 
            height={tank2Level * 1.4} 
            fill="#a855f7" 
            opacity="0.3"
          />
          <text x="50" y="-10" textAnchor="middle" fill="#a855f7" fontSize="14">Raw Material B</text>
          <text x="50" y="170" textAnchor="middle" fill="#9ca3af" fontSize="12">{tank2Level.toFixed(0)}%</text>
        </g>

        {/* Main Mixer */}
        <g transform="translate(400, 100)">
          <circle cx="75" cy="75" r="70" fill="none" stroke="#22d3ee" strokeWidth="3" />
          <rect 
            x="5" 
            y={145 - (mixerLevel * 1.4)} 
            width="140" 
            height={mixerLevel * 1.4} 
            fill="#22d3ee" 
            opacity="0.3"
            clipPath="circle(70px at 75px 75px)"
          />
          
          {/* Mixer Blades */}
          <g transform={`translate(75, 75) rotate(${mixerRotation})`}>
            <rect x="-40" y="-3" width="80" height="6" fill="#06b6d4" />
            <rect x="-3" y="-40" width="6" height="80" fill="#06b6d4" />
          </g>
          
          <text x="75" y="-20" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">Main Mixer</text>
          <text x="75" y="170" textAnchor="middle" fill="#9ca3af" fontSize="12">{mixerLevel.toFixed(0)}%</text>
          <text x="75" y="190" textAnchor="middle" fill="#fbbf24" fontSize="11">Temp: {parameters.temperature}°C</text>
        </g>

        {/* Quality Check Tank */}
        <g transform="translate(600, 50)">
          <rect x="0" y="0" width="100" height="150" fill="none" stroke="#10b981" strokeWidth="2" rx="5" />
          <rect 
            x="5" 
            y={150 - (qualityTankLevel * 1.4)} 
            width="90" 
            height={qualityTankLevel * 1.4} 
            fill="#10b981" 
            opacity="0.3"
          />
          <text x="50" y="-10" textAnchor="middle" fill="#10b981" fontSize="14">Quality Check</text>
          <text x="50" y="170" textAnchor="middle" fill="#9ca3af" fontSize="12">{qualityTankLevel.toFixed(0)}%</text>
          <text x="50" y="190" textAnchor="middle" fill="#9ca3af" fontSize="11">Recipe: {parameters.recipe}</text>
        </g>

        {/* Pipes */}
        <line x1="200" y1="125" x2="400" y2="175" stroke={flow1Active ? "#06b6d4" : "#374151"} strokeWidth="4" />
        <line x1="350" y1="125" x2="400" y2="150" stroke={flow2Active ? "#a855f7" : "#374151"} strokeWidth="4" />
        <line x1="545" y1="175" x2="600" y2="125" stroke={flowToQuality ? "#10b981" : "#374151"} strokeWidth="4" />

        {/* Flow animations */}
        {flow1Active && (
          <circle r="3" fill="#06b6d4">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href="#flow1Path" />
            </animateMotion>
          </circle>
        )}
        {flow2Active && (
          <circle r="3" fill="#a855f7">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href="#flow2Path" />
            </animateMotion>
          </circle>
        )}
        {flowToQuality && (
          <circle r="3" fill="#10b981">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href="#flow3Path" />
            </animateMotion>
          </circle>
        )}

        {/* Hidden paths for flow animation */}
        <path id="flow1Path" d="M 200 125 L 400 175" fill="none" />
        <path id="flow2Path" d="M 350 125 L 400 150" fill="none" />
        <path id="flow3Path" d="M 545 175 L 600 125" fill="none" />

        {/* Status Indicators */}
        <g transform="translate(50, 320)">
          <rect x="0" y="0" width="700" height="50" fill="#1f2937" rx="5" opacity="0.5" />
          <text x="20" y="30" fill="#9ca3af" fontSize="14">
            Speed: {parameters.speed}% | Pressure: {parameters.pressure} PSI | Status: {isRunning ? 'RUNNING' : 'STOPPED'}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BatteryMixingSystem;