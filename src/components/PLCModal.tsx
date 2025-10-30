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
    recipe: '6'
  });
  const [ladderRungs, setLadderRungs] = useState([
    { id: 1, active: false, label: 'Start Button' },
    { id: 2, active: false, label: 'Safety Check' },
    { id: 3, active: false, label: 'Motor Control' },
    { id: 4, active: false, label: 'Process Timer' },
    { id: 5, active: false, label: 'Output Enable' }
  ]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setLadderRungs(prev => {
          const next = [...prev];
          const activeIndex = next.findIndex(r => r.active);
          if (activeIndex >= 0) next[activeIndex].active = false;
          const nextIndex = (activeIndex + 1) % next.length;
          next[nextIndex].active = true;
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  if (!isOpen) return null;

  const handleStart = () => {
    setIsRunning(true);
    setLadderRungs(prev => {
      const next = [...prev];
      next[0].active = true;
      return next;
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setLadderRungs(prev => prev.map(r => ({ ...r, active: false })));
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
        <div className="flex flex-col h-[80vh]">
          {/* Visual System Display (static, non-scrollable) */}
          <div className="flex-1 min-h-[400px] bg-gray-800/50 border border-cyan-500/20 rounded-t-2xl p-4 overflow-hidden">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">System Visualization</h3>
            {type === 'battery' && <BatteryMixingSystem isRunning={isRunning} parameters={parameters} />}
            {type === 'conveyor' && <ConveyorSortingSystem isRunning={isRunning} parameters={parameters} />}
            {type === 'robot' && <RobotPickPlaceSystem isRunning={isRunning} parameters={parameters} />}
          </div>
          {/* HMI Control Panel at the bottom, scrollable if needed */}
          <div className="max-h-[260px] overflow-y-auto bg-gray-900 border-t border-cyan-500/30 rounded-b-2xl p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">HMI Control Panel</h3>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded flex items-center justify-center gap-2 transition-all"
              >
                <Play size={20} /> Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded flex items-center justify-center gap-2 transition-all"
              >
                <Pause size={20} /> Stop
              </button>
              <button
                onClick={() => {
                  handleStop();
                  setParameters(prev => ({ ...prev, reset: true }));
                  setTimeout(() => setParameters(prev => ({ ...prev, reset: false })), 100);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw size={20} /> Reset
              </button>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-200">Speed</span>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={parameters.speed > 25 ? 25 : parameters.speed}
                  onChange={(e) => setParameters({...parameters, speed: Math.min(25, parseInt(e.target.value))})}
                  className="w-full accent-cyan-500"
                />
                <span className="text-sm text-gray-200">{parameters.speed}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PLCModal;