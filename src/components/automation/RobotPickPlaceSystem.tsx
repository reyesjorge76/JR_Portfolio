import React, { useState, useEffect } from 'react';

interface RobotPickPlaceSystemProps {
  isRunning: boolean;
  parameters: {
    speed: number;
    temperature: number;
    pressure: number;
    recipe: string;
    reset?: boolean;
  };
}


const RobotPickPlaceSystem: React.FC<RobotPickPlaceSystemProps> = ({ isRunning, parameters }) => {
  // Show left/right buttons only when not running
  const [armPosition, setArmPosition] = useState({ x: 400, y: 200 }); // End effector position
  const [gripperOpen, setGripperOpen] = useState(true);
  const [itemsPlaced, setItemsPlaced] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('idle');
  const [cycleProgress, setCycleProgress] = useState(0);
  const [hasItem, setHasItem] = useState(false);
  const [palletCount, setPalletCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [lastResetFlag, setLastResetFlag] = useState(false);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [partInTransit, setPartInTransit] = useState<{x: number, y: number} | null>(null);
  const [partPlaced, setPartPlaced] = useState(false);
  const [wasRunning, setWasRunning] = useState(false);

  // Use recipe prop for parts per pallet
  const partsPerPallet = Number(parameters.recipe) || 6;
  // State arrays depend on partsPerPallet
  const [placedPositions, setPlacedPositions] = useState<boolean[]>(() => new Array(partsPerPallet).fill(false));
  const [pickedPositions, setPickedPositions] = useState<boolean[]>(() => new Array(partsPerPallet).fill(false));
  const [completedTransfers, setCompletedTransfers] = useState<boolean[]>(() => new Array(partsPerPallet).fill(false));

  // Update state arrays when partsPerPallet (recipe) changes
  useEffect(() => {
    setPlacedPositions(new Array(partsPerPallet).fill(false));
    setPickedPositions(new Array(partsPerPallet).fill(false));
    setCompletedTransfers(new Array(partsPerPallet).fill(false));
    setCurrentPickIndex(0);
    setPalletCount(0);
    setItemsPlaced(0);
  }, [partsPerPallet]);

  // Grid layout: always 3 columns, rows depend on partsPerPallet
  const gridCols = 3;
  const gridRows = Math.ceil(partsPerPallet / 3);
  const getGridPosition = (index: number, baseX: number, baseY: number) => {
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;
    return {
      x: baseX + col * 30,
      y: baseY + row * 30
    };
  };

  const pickAreaBase = { x: 170, y: 260 };
  const placeAreaBase = { x: 560, y: 260 };
  const homePosition = { x: 400, y: 200 };

  // Calculate arm angles based on end effector position
  const calculateArmAngles = (targetX: number, targetY: number) => {
    const baseX = 400;
    const baseY = 300;
    const armLength = 120;
    
    const deltaX = targetX - baseX;
    const deltaY = targetY - baseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Clamp distance to arm reach
    const clampedDistance = Math.min(distance, armLength);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;
    
    return { angle, reach: clampedDistance / armLength };
  };

  useEffect(() => {
    // Handle manual reset button - only trigger on change from false to true
    if (parameters.reset && !lastResetFlag && !isResetting) {
      performReset();
    }
    setLastResetFlag(parameters.reset || false);
  }, [parameters.reset, lastResetFlag, isResetting]);

  const performReset = () => {
    setIsResetting(true);
    setCurrentPhase('resetting system');
    setArmPosition(homePosition); // Move arm to home immediately for visual feedback
    setTimeout(() => {
      // Reset all states
      setPalletCount(0);
      setCurrentPickIndex(0);
      setItemsPlaced(0);
      setIsResetting(false);
      setCycleProgress(0);
      setArmPosition(homePosition); // Ensure arm is at home after reset
      setCurrentPhase('idle');
      setGripperOpen(true);
      setHasItem(false);
      setPartInTransit(null);
      setPartPlaced(false);
      setPlacedPositions(new Array(partsPerPallet).fill(false));
      setPickedPositions(new Array(partsPerPallet).fill(false));
      setCompletedTransfers(new Array(partsPerPallet).fill(false));
    }, 2000);
  };

  // Reset cycle-specific states when starting animation
  useEffect(() => {
    // Only reset when transitioning from stopped to running (not already running)
    if (isRunning && !wasRunning && !isResetting) {
      // Reset cycle states to start fresh
      setCycleProgress(0);
      setArmPosition(homePosition);
      setCurrentPhase('idle');
      setGripperOpen(true);
      setHasItem(false);
      setPartInTransit(null);
      setPartPlaced(false);
    }
    // Update the previous running state
    setWasRunning(isRunning);
  }, [isRunning, wasRunning]);

  useEffect(() => {
    if (isRunning && !isResetting && currentPickIndex < partsPerPallet) {
      const interval = setInterval(() => {
        setCycleProgress(prev => {
          // Limit speed to 25% for program mode
          const limitedSpeed = Math.min(parameters.speed, 25);
          let newProgress = prev + (limitedSpeed / 8);
          
          // Get current pick and place positions
          const currentPickPos = getGridPosition(currentPickIndex, pickAreaBase.x, pickAreaBase.y);
          const currentPlacePos = getGridPosition(currentPickIndex, placeAreaBase.x, placeAreaBase.y);
          
          // Determine phase based on progress
          if (newProgress < 15) {
            // Move to current pick position
            setCurrentPhase(`moving to pick position ${currentPickIndex + 1}`);
            setGripperOpen(true);
            setPartInTransit(null);
            const t = newProgress / 15;
            const newX = homePosition.x + (currentPickPos.x - homePosition.x) * t;
            const newY = homePosition.y + (currentPickPos.y - homePosition.y) * t;
            setArmPosition({ x: newX, y: newY });
          } else if (newProgress < 25) {
            // Pick up item from specific position
            setCurrentPhase(`picking from position ${currentPickIndex + 1}`);
            setArmPosition(currentPickPos);
            if (newProgress > 20) {
              setGripperOpen(false);
              setHasItem(true);
              // Mark this position as picked
              setPickedPositions(prev => {
                const newPositions = [...prev];
                newPositions[currentPickIndex] = true;
                return newPositions;
              });
            }
          } else if (newProgress < 65) {
            // Move to corresponding place position with item
            setCurrentPhase(`moving to place position ${currentPickIndex + 1}`);
            setGripperOpen(false);
            const t = (newProgress - 25) / 40;
            const newX = currentPickPos.x + (currentPlacePos.x - currentPickPos.x) * t;
            const newY = currentPickPos.y + (currentPlacePos.y - currentPickPos.y) * t;
            setArmPosition({ x: newX, y: newY });
            // Show item in transit only during this phase
            setPartInTransit({ x: newX, y: newY - 15 });
          } else if (newProgress < 80) {
            // Place item at specific position
            setCurrentPhase(`placing at position ${currentPickIndex + 1}`);
            setArmPosition(currentPlacePos);
            if (newProgress > 70 && !partPlaced) {
              // First clear transit item and place it
              setPartInTransit(null);
              setGripperOpen(true);
              setHasItem(false);
              // Mark this transfer as completed
              setCompletedTransfers(prev => {
                const newTransfers = [...prev];
                if (!newTransfers[currentPickIndex]) {
                  newTransfers[currentPickIndex] = true;
                  setItemsPlaced(prev => prev + 1);
                }
                return newTransfers;
              });
              setPalletCount(prev => prev + 1);
              setPartPlaced(true);
            } else if (hasItem) {
              // Keep showing transit item until actually placed
              setPartInTransit({ x: currentPlacePos.x, y: currentPlacePos.y - 15 });
            }
          } else if (newProgress < 100) {
            // Return to home
            setCurrentPhase('returning home');
            setGripperOpen(true);
            setHasItem(false); // Ensure item is cleared
            setPartInTransit(null); // Ensure transit is cleared
            const t = (newProgress - 80) / 20;
            const newX = currentPlacePos.x + (homePosition.x - currentPlacePos.x) * t;
            const newY = currentPlacePos.y + (homePosition.y - currentPlacePos.y) * t;
            setArmPosition({ x: newX, y: newY });
          } else {
            // Reset cycle when complete
            newProgress = 0;
            setCurrentPickIndex(prev => prev + 1);
            setPartPlaced(false);
            // Clear all item states for clean cycle start
            setHasItem(false);
            setPartInTransit(null);
            setGripperOpen(true);
            return newProgress;
          }
          
          return newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    } else if (!isRunning && !isResetting) {
      setCurrentPhase('idle');
      // Only pause: do not reset any part progress or arrays
      // Optionally, move arm to home for visual clarity
      setArmPosition(homePosition);
      setGripperOpen(true);
      setHasItem(false);
      setPartInTransit(null);
      setPartPlaced(false);
      // Do NOT reset pickedPositions or completedTransfers here
      // Keep placedPositions - don't clear them when stopping
    }
  }, [isRunning, parameters.speed, isResetting, currentPickIndex, partsPerPallet]);

  // Separate effect for auto-reset logic
  useEffect(() => {
    if (isRunning && !isResetting && currentPickIndex >= partsPerPallet) {
      performReset();
    }
  }, [currentPickIndex, isRunning, isResetting, partsPerPallet]);

  const { angle: armAngle, reach } = calculateArmAngles(armPosition.x, armPosition.y);

  // Manual move handlers
  // Move robot arm to pick position in manual mode
  const moveArmToPick = (pickIdx: number) => {
    const pickPos = getGridPosition(pickIdx, pickAreaBase.x, pickAreaBase.y);
    setArmPosition(pickPos);
    setCurrentPhase(`manual move to pick position ${pickIdx + 1}`);
  };
  const handleMoveLeft = () => {
    setCurrentPickIndex(idx => {
      const newIdx = Math.max(0, idx - 1);
      moveArmToPick(newIdx);
      return newIdx;
    });
  };
  const handleMoveRight = () => {
    setCurrentPickIndex(idx => {
      const newIdx = Math.min(partsPerPallet - 1, idx + 1);
      moveArmToPick(newIdx);
      return newIdx;
    });
  };

  // On stopping auto, move arm to current pick
  React.useEffect(() => {
    if (!isRunning) {
      moveArmToPick(currentPickIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentPickIndex, partsPerPallet]);

  return (
    <div className="relative h-96 bg-gray-900/50 rounded-lg p-4">
      {/* Robot only moves when isRunning (auto) is true */}
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Title */}
        <text x="400" y="30" textAnchor="middle" fill="#22d3ee" fontSize="18" fontWeight="bold">
          Robot Pick & Place System
        </text>
        <text x="400" y="50" textAnchor="middle" fill="#9ca3af" fontSize="12">
          Speed: {parameters.speed}% | Items Placed: {itemsPlaced} | Pallet: {palletCount}/{partsPerPallet} | Current: {currentPickIndex + 1} | Phase: {currentPhase}
        </text>
        <text x="400" y="70" textAnchor="middle" fill="#9ca3af" fontSize="10">
          Debug: Pick Index: {currentPickIndex} | Completed: {completedTransfers.filter(Boolean).length} | Transfers: [{completedTransfers.map(p => p ? '1' : '0').join(',')}] | Reset: {isResetting ? 'Yes' : 'No'}
        </text>

        {/* Robot Base */}
        <rect x="380" y="300" width="40" height="60" fill="#374151" stroke="#6b7280" strokeWidth="2" />
        
        {/* Robot Arm - Upper arm */}
        <g transform={`translate(400, 300)`}>
          <line 
            x1="0" 
            y1="0" 
            x2={Math.cos((armAngle + 90) * Math.PI / 180) * 80 * reach}
            y2={Math.sin((armAngle + 90) * Math.PI / 180) * 80 * reach}
            stroke="#06b6d4" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          
          {/* Forearm */}
          <line 
            x1={Math.cos((armAngle + 90) * Math.PI / 180) * 80 * reach}
            y1={Math.sin((armAngle + 90) * Math.PI / 180) * 80 * reach}
            x2={armPosition.x - 400}
            y2={armPosition.y - 300}
            stroke="#0891b2" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          
          {/* Joint */}
          <circle 
            cx={Math.cos((armAngle + 90) * Math.PI / 180) * 80 * reach}
            cy={Math.sin((armAngle + 90) * Math.PI / 180) * 80 * reach}
            r="6" 
            fill="#374151" 
            stroke="#6b7280" 
            strokeWidth="2"
          />
        </g>
        
        {/* End Effector/Gripper */}
        <g transform={`translate(${armPosition.x}, ${armPosition.y})`}>
          <rect x="-15" y="-5" width="30" height="10" fill="#a855f7" rx="2" />
          <rect x={gripperOpen ? -20 : -15} y="-5" width="5" height="15" fill="#9333ea" rx="1" />
          <rect x={gripperOpen ? 15 : 10} y="-5" width="5" height="15" fill="#9333ea" rx="1" />
        </g>

        {/* Pick Area */}
  <rect x="150" y="250" width="100" height="60" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
        <text x="200" y="240" textAnchor="middle" fill="#10b981" fontSize="12">Pick Area (Grid)</text>
        
        {/* Place Area / Pallet */}
        <rect x="550" y="250" width="100" height="60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
        <text x="600" y="240" textAnchor="middle" fill="#f59e0b" fontSize="12">Place Area (Grid)</text>
        
        {/* Pick area grid lines */}
        <g stroke="#10b981" strokeWidth="1" opacity="0.3">
          {/* Dynamic grid lines for pick area */}
          {(() => {
            const baseX = 170;
            const baseY = 260 - 2;
            const lines = [];
            // Vertical lines
            for (let i = 0; i <= gridCols; i++) {
              lines.push(<line key={`v-pick-${i}`} x1={baseX + i * 30} y1={baseY} x2={baseX + i * 30} y2={baseY + gridRows * 30} />);
            }
            // Horizontal lines
            for (let i = 0; i <= gridRows; i++) {
              lines.push(<line key={`h-pick-${i}`} x1={baseX} y1={baseY + i * 30} x2={baseX + gridCols * 30} y2={baseY + i * 30} />);
            }
            return lines;
          })()}
        </g>
        
        {/* Place area grid lines */}
        <g stroke="#f59e0b" strokeWidth="1" opacity="0.3">
          {/* Dynamic grid lines for place area */}
          {(() => {
            const baseX = 560 - 3;
            const baseY = 260 - 2;
            const lines = [];
            // Vertical lines
            for (let i = 0; i <= gridCols; i++) {
              lines.push(<line key={`v-place-${i}`} x1={baseX + i * 30} y1={baseY} x2={baseX + i * 30} y2={baseY + gridRows * 30} />);
            }
            // Horizontal lines
            for (let i = 0; i <= gridRows; i++) {
              lines.push(<line key={`h-place-${i}`} x1={baseX} y1={baseY + i * 30} x2={baseX + gridCols * 30} y2={baseY + i * 30} />);
            }
            return lines;
          })()}
        </g>
        
        {/* Grid position labels for debugging */}
        {Array.from({ length: partsPerPallet }, (_, i) => {
          const pickPos = getGridPosition(i, pickAreaBase.x, pickAreaBase.y);
          const placePos = getGridPosition(i, placeAreaBase.x, placeAreaBase.y);
          return (
            <g key={`grid-labels-${i}`} fill="#9ca3af" fontSize="8" opacity="0.5">
              <text x={pickPos.x} y={pickPos.y + 20} textAnchor="middle">{i + 1}</text>
              <text x={placePos.x} y={placePos.y + 20} textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}

        {/* Available parts in pick area grid */}
        {Array.from({ length: partsPerPallet }, (_, i) => {
          const pos = getGridPosition(i, pickAreaBase.x, pickAreaBase.y);
          const isNextToPick = i === currentPickIndex;
          const alreadyPicked = pickedPositions[i];
          
          // Only show parts that haven't been picked yet
          return !alreadyPicked && !isResetting ? (
            <rect 
              key={`available-${i}`}
              x={pos.x - 10} 
              y={pos.y - 10} 
              width="20" 
              height="20" 
              fill={isNextToPick ? "#ff6b35" : "#ef4444"}
              stroke="#fff" 
              strokeWidth={isNextToPick ? "2" : "1"}
              rx="2"
              opacity={isNextToPick ? 0.8 : 1}
            />
          ) : null;
        })}
        
        {/* Item being carried during transfer */}
        {partInTransit && (
          <rect 
            x={partInTransit.x - 10} 
            y={partInTransit.y - 10} 
            width="20" 
            height="20" 
            fill="#ff6b35" 
            stroke="#fff" 
            strokeWidth="2" 
            rx="2"
          />
        )}
        
        {/* Item attached to gripper when picking/placing */}
        {hasItem && !partInTransit && (currentPhase.includes('picking') || currentPhase.includes('placing')) && (
          <rect 
            x={armPosition.x - 10} 
            y={armPosition.y + 5} 
            width="20" 
            height="20" 
            fill="#ff6b35" 
            stroke="#fff" 
            strokeWidth="2" 
            rx="2"
          />
        )}
        
        {/* Placed items on pallet grid - show only after completed transfers */}
        {completedTransfers.map((transferCompleted, i) => {
          console.log(`Position ${i}: transferCompleted = ${transferCompleted}`); // Debug log
          if (!transferCompleted) return null;
          const pos = getGridPosition(i, placeAreaBase.x, placeAreaBase.y);
          console.log(`Rendering placed part at position ${i}:`, pos); // Debug log
          return (
            <rect 
              key={`placed-${i}`}
              x={pos.x - 10} 
              y={pos.y - 10} 
              width="20" 
              height="20" 
              fill="#10b981" 
              stroke="#fff" 
              strokeWidth="1" 
              rx="2"
            />
          );
        })}
        
        {/* Debug: Show all grid positions for placed items */}
        {Array.from({ length: partsPerPallet }, (_, i) => {
          const pos = getGridPosition(i, placeAreaBase.x, placeAreaBase.y);
          const isPlaced = completedTransfers[i]; // Use completed transfers as placed indicator
          return (
            <circle
              key={`debug-place-${i}`}
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill={isPlaced ? "yellow" : "gray"}
              opacity="0.5"
            />
          );
        })}
        
        {/* Reset animation effect */}
        {isResetting && (
          <g opacity="0.8">
            <rect x="150" y="250" width="500" height="60" fill="#fbbf24" opacity="0.3" />
            <text x="400" y="285" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">
              🔄 RESETTING SYSTEM...
            </text>
          </g>
        )}
        
        {/* Status Indicators */}
        <g transform="translate(50, 100)">
          <rect x="0" y="0" width="150" height="120" fill="#1f2937" rx="5" opacity="0.8" />
          <text x="10" y="20" fill="#9ca3af" fontSize="12">Robot Status:</text>
          <circle cx="20" cy="40" r="5" fill={isRunning ? '#10b981' : '#ef4444'} />
          <text x="35" y="45" fill="#9ca3af" fontSize="11">{isRunning ? 'Running' : 'Stopped'}</text>
          <text x="10" y="65" fill="#9ca3af" fontSize="11">Gripper: {gripperOpen ? 'Open' : 'Closed'}</text>
          <text x="10" y="80" fill="#9ca3af" fontSize="11">Has Item: {hasItem ? 'Yes' : 'No'}</text>
          <text x="10" y="95" fill="#9ca3af" fontSize="11">Progress: {Math.round(cycleProgress)}%</text>
          <text x="10" y="110" fill="#9ca3af" fontSize="11">Parts Left: {partsPerPallet - completedTransfers.filter(Boolean).length}</text>
          {isResetting && (
            <text x="10" y="125" fill="#fbbf24" fontSize="11" fontWeight="bold">🔄 Resetting...</text>
          )}
        </g>

        {/* Performance Metrics */}
        <g transform="translate(600, 100)">
          <rect x="0" y="0" width="150" height="100" fill="#1f2937" rx="5" opacity="0.8" />
          <text x="10" y="20" fill="#9ca3af" fontSize="12">Performance:</text>
          <text x="10" y="40" fill="#9ca3af" fontSize="11">Cycle Time: 5s</text>
          <text x="10" y="55" fill="#9ca3af" fontSize="11">Accuracy: 98%</text>
          <text x="10" y="70" fill="#9ca3af" fontSize="11">Recipe: {parameters.recipe}</text>
          <text x="10" y="85" fill="#9ca3af" fontSize="11">Pallet Status: {palletCount}/6</text>
          <text x="10" y="100" fill="#9ca3af" fontSize="11">
            Mode: {isRunning ? 'Auto' : 'Manual'}
          </text>
        </g>

        {/* Trajectory Path - showing path from current pick to place position */}
        {isRunning && currentPickIndex < partsPerPallet && (
          <g opacity="0.3">
            <path 
              d={`M 400 200 L ${getGridPosition(currentPickIndex, pickAreaBase.x, pickAreaBase.y).x} ${getGridPosition(currentPickIndex, pickAreaBase.x, pickAreaBase.y).y} L ${getGridPosition(currentPickIndex, placeAreaBase.x, placeAreaBase.y).x} ${getGridPosition(currentPickIndex, placeAreaBase.x, placeAreaBase.y).y} L 400 200`} 
              fill="none" 
              stroke="#22d3ee" 
              strokeWidth="1" 
              strokeDasharray="2,2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default RobotPickPlaceSystem;