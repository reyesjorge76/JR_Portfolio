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

      </div>
    </div>
  );
}

export default PLCModal;