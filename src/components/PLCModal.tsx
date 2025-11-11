import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import BatteryMixingSystem from './automation/BatteryMixingSystem';
import ConveyorSortingSystem from './automation/ConveyorSortingSystem';
import RobotPickPlaceSystem from './automation/RobotPickPlaceSystem';

interface PLCModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'battery' | 'conveyor' | 'robot';
}

const PLCModal: React.FC<PLCModalProps> = ({ isOpen, onClose, title, type }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState({
    speed: 25,
    temperature: 25,
    pressure: 100,
    recipe: '6',
    partsPerSecond: 1
  });




  if (!isOpen) return null;

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setParameters(prev => ({ ...prev, reset: true }));
    setTimeout(() => setParameters(prev => ({ ...prev, reset: false })), 100);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 p-4 border-b border-cyan-500/30 flex justify-between items-center relative">
          <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }} 
            className="relative z-20 text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer flex-shrink-0"
            type="button"
            aria-label="Close modal"
            style={{ pointerEvents: 'auto' }}
          >
            <X size={24} />
          </button>
        </div>
        {/* Visual System Display */}
        <div className="flex-1 min-h-[400px] bg-gray-800/50 border border-cyan-500/20 rounded-t-2xl p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">System Visualization</h3>
          {type === 'battery' && <BatteryMixingSystem isRunning={isRunning} parameters={parameters} />}
          {type === 'conveyor' && <ConveyorSortingSystem isRunning={isRunning} parameters={parameters} />}
          {type === 'robot' && <RobotPickPlaceSystem isRunning={isRunning} parameters={parameters} />}
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800 border-t border-cyan-500/30 p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
              >
                <Play size={20} /> Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
              >
                <Pause size={20} /> Stop
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <RotateCcw size={20} /> Reset
              </button>
            </div>
            
            {/* Parameters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Speed (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={parameters.speed}
                  onChange={(e) => setParameters({ ...parameters, speed: Number(e.target.value) })}
                  className="bg-gray-700 text-white px-3 py-2 rounded w-20 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              {type === 'conveyor' && (
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">Parts/Sec</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parameters.partsPerSecond}
                    onChange={(e) => setParameters({ ...parameters, partsPerSecond: Number(e.target.value) })}
                    className="bg-gray-700 text-white px-3 py-2 rounded w-20 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PLCModal;