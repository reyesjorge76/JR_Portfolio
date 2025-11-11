  // Map color, shape, size to a unique index (0-26)
  const getCounterIndex = (color: string, shape: string, size: string) => {
    // Order: color (0: red, 1: blue, 2: green), shape (0: circle, 1: square, 2: triangle), size (0: small, 1: medium, 2: large)
    const colorIdx = color === '#ef4444' ? 0 : color === '#3b82f6' ? 1 : 2;
    const shapeIdx = shape === 'circle' ? 0 : shape === 'square' ? 1 : 2;
    const sizeIdx = size === 'small' ? 0 : size === 'medium' ? 1 : 2;
    return colorIdx * 9 + shapeIdx * 3 + sizeIdx;
  };
import React, { useState, useEffect } from 'react';

interface ConveyorSortingSystemProps {
  isRunning: boolean;
  parameters: {
    speed: number;
    temperature: number;
    pressure: number;
    recipe: string;
    partsPerSecond?: number;
    reset?: boolean;
  };
}

interface Part {
  id: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: 'small' | 'medium' | 'large';
  phase: 0 | 1 | 2 | 3; // 0: main, 1: color, 2: shape, 3: size
  progress: number; // 0 to 1 for each phase
}

const ConveyorSortingSystem: React.FC<ConveyorSortingSystemProps> = ({ isRunning, parameters }) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [sortedCounts, setSortedCounts] = useState({
    red: 0, blue: 0, green: 0,
    circle: 0, square: 0, triangle: 0,
    small: 0, medium: 0, large: 0
  });
  const [nextId, setNextId] = useState(1);
  const [counters, setCounters] = useState<number[]>(Array(27).fill(0));

  // Reset effect
  useEffect(() => {
    if (parameters.reset) {
      setParts([]);
      setCounters(Array(27).fill(0));
      setSortedCounts({
        red: 0, blue: 0, green: 0,
        circle: 0, square: 0, triangle: 0,
        small: 0, medium: 0, large: 0
      });
      setNextId(1);
    }
  }, [parameters.reset]);

  useEffect(() => {
    let partTimer: NodeJS.Timeout | null = null;
    let moveTimer: NodeJS.Timeout | null = null;
    if (isRunning) {
      // Throttle part generation: add a new part every X ms (1-5 per second)
      const intervalMs = 1000 / (parameters.partsPerSecond || 1);
      partTimer = setInterval(() => {
        const colors = ['#ef4444', '#3b82f6', '#10b981'];
        const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const newPart: Part = {
          id: nextId,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          size: sizes[Math.floor(Math.random() * sizes.length)],
          phase: 0,
          progress: 0
        };
        setParts(prev => [...prev, newPart]);
        setNextId(prev => prev + 1);
  }, intervalMs); // timer for part creation, adjustable


      // Move parts along conveyor every 100ms
      moveTimer = setInterval(() => {
        setParts(prev => prev.map(part => {
          // Define path segments for each phase
          // Phase 0: main conveyor (straight)
          // Phase 1: color branch (diagonal or straight)
          // Phase 2: shape branch (diagonal or straight)
          // Phase 3: size branch (diagonal or straight)
          const speed = parameters.speed / 400; // adjust for smoothness
          let { phase, progress } = part;
          let x = -140, y = 540;
          // Main conveyor: -140,540 to 100,540
          if (phase === 0) {
            x = -140 + 240 * progress;
            y = 540;
            if (progress >= 1) { phase = 1; progress = 0; }
          }
          // Color branch
          else if (phase === 1) {
            if (part.color === '#ef4444') {
              // Red: 100,540 to 430,175
              x = 100 + 330 * progress;
              y = 540 + (175-540) * progress;
            } else if (part.color === '#3b82f6') {
              // Blue: 100,540 to 430,540
              x = 100 + 330 * progress;
              y = 540;
            } else if (part.color === '#10b981') {
              // Green: 100,540 to 430,900
              x = 100 + 330 * progress;
              y = 540 + (900-540) * progress;
            }
            if (progress >= 1) { phase = 2; progress = 0; }
          }
          // Shape branch
          else if (phase === 2) {
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') {
                // 430,175 to 800,60
                x = 430 + 370 * progress;
                y = 175 + (60-175) * progress;
              } else if (part.shape === 'square') {
                // 430,175 to 800,180
                x = 430 + 370 * progress;
                y = 175 + (180-175) * progress;
              } else {
                // triangle: 430,175 to 800,300
                x = 430 + 370 * progress;
                y = 175 + (300-175) * progress;
              }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') {
                // 430,540 to 800,420
                x = 430 + 370 * progress;
                y = 540 + (420-540) * progress;
              } else if (part.shape === 'square') {
                // 430,540 to 800,540
                x = 430 + 370 * progress;
                y = 540;
              } else {
                // triangle: 430,540 to 800,660
                x = 430 + 370 * progress;
                y = 540 + (660-540) * progress;
              }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') {
                // 430,900 to 800,780
                x = 430 + 370 * progress;
                y = 900 + (780-900) * progress;
              } else if (part.shape === 'square') {
                // 430,900 to 800,900
                x = 430 + 370 * progress;
                y = 900;
              } else {
                // triangle: 430,900 to 800,1020
                x = 430 + 370 * progress;
                y = 900 + (1020-900) * progress;
              }
            }
            if (progress >= 1) { phase = 3; progress = 0; }
          }
          // Size branch
          else if (phase === 3) {
            // Red
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') {
                // 800,60 to 1150,20/60/100
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 60 + (20-60) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 60;
                } else {
                  x = 800 + 350 * progress;
                  y = 60 + (100-60) * progress;
                }
              } else if (part.shape === 'square') {
                // 800,180 to 1150,140/180/220
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 180 + (140-180) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 180;
                } else {
                  x = 800 + 350 * progress;
                  y = 180 + (220-180) * progress;
                }
              } else {
                // triangle: 800,300 to 1150,260/300/340
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 300 + (260-300) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 300;
                } else {
                  x = 800 + 350 * progress;
                  y = 300 + (340-300) * progress;
                }
              }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') {
                // 800,420 to 1150,380/420/460
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 420 + (380-420) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 420;
                } else {
                  x = 800 + 350 * progress;
                  y = 420 + (460-420) * progress;
                }
              } else if (part.shape === 'square') {
                // 800,540 to 1150,500/540/580
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 540 + (500-540) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 540;
                } else {
                  x = 800 + 350 * progress;
                  y = 540 + (580-540) * progress;
                }
              } else {
                // triangle: 800,660 to 1150,620/660/700
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 660 + (620-660) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 660;
                } else {
                  x = 800 + 350 * progress;
                  y = 660 + (700-660) * progress;
                }
              }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') {
                // 800,780 to 1150,740/780/820
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 780 + (740-780) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 780;
                } else {
                  x = 800 + 350 * progress;
                  y = 780 + (820-780) * progress;
                }
              } else if (part.shape === 'square') {
                // 800,900 to 1150,860/900/940
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 900 + (860-900) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 900;
                } else {
                  x = 800 + 350 * progress;
                  y = 900 + (940-900) * progress;
                }
              } else {
                // triangle: 800,1020 to 1150,980/1020/1060
                if (part.size === 'small') {
                  x = 800 + 350 * progress;
                  y = 1020 + (980-1020) * progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * progress;
                  y = 1020;
                } else {
                  x = 800 + 350 * progress;
                  y = 1020 + (1060-1020) * progress;
                }
              }
            }
            // if (progress >= 1) { phase = 4; progress = 1; } // End (removed, use finished boolean instead)
          }
          // Advance progress
          let finished = false;
          if (phase < 3) progress = Math.min(progress + speed, 1);
          else if (phase === 3) {
            progress = Math.min(progress + speed, 1);
            if (progress >= 1) finished = true;
          }
          return { ...part, phase, progress, finished };
        }));
        // Remove parts that reached the end and update counts
        setParts(prev => {
          const toRemove: typeof prev = [];
          const remaining = prev.filter(part => {
            if ((part as any).finished) {
              // Update 27-lane counters
              const idx = getCounterIndex(part.color, part.shape, part.size);
              setCounters(counters => {
                const updated = [...counters];
                updated[idx]++;
                return updated;
              });
              // Optionally update sortedCounts if still needed
              setSortedCounts(counts => ({
                ...counts,
                red: counts.red + (part.color === '#ef4444' ? 1 : 0),
                blue: counts.blue + (part.color === '#3b82f6' ? 1 : 0),
                green: counts.green + (part.color === '#10b981' ? 1 : 0),
                circle: counts.circle + (part.shape === 'circle' ? 1 : 0),
                square: counts.square + (part.shape === 'square' ? 1 : 0),
                triangle: counts.triangle + (part.shape === 'triangle' ? 1 : 0),
                small: counts.small + (part.size === 'small' ? 1 : 0),
                medium: counts.medium + (part.size === 'medium' ? 1 : 0),
                large: counts.large + (part.size === 'large' ? 1 : 0)
              }));
              return false;
            }
            return true;
          });
          return remaining;
        });
      }, 100);

      return () => {
        if (partTimer) clearInterval(partTimer);
        if (moveTimer) clearInterval(moveTimer);
      };
    }
    return () => {
      if (partTimer) clearInterval(partTimer);
      if (moveTimer) clearInterval(moveTimer);
    };
  }, [isRunning, parameters.speed, nextId]);

  const getPartSize = (size: string) => {
    switch(size) {
      case 'small': return 10;
      case 'medium': return 15;
      case 'large': return 20;
      default: return 15;
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-[400px] h-auto md:h-[100vh] md:max-h-[910px] bg-gray-900/50 rounded-lg p-2 md:p-4 overflow-auto">
      <svg viewBox="-150 0 1350 1150" className="w-full h-auto md:h-full max-w-full min-w-[300px]" preserveAspectRatio="xMidYMid meet">
        {/* Backgrounds for each sorting stage */}
        {/* <rect x="0" y="0" width="1200" height="220" fill="#f1f5f9" opacity="0.3" />
        <rect x="0" y="220" width="1200" height="220" fill="#e0e7ef" opacity="0.3" />
        <rect x="0" y="440" width="1200" height="440" fill="#fef9c3" opacity="0.3" /> */}

        {/* Main conveyor - centered vertically at y=410 */}
        <rect x="-140" y="520" width="250" height="40" fill="#374151" stroke="#6b7280" strokeWidth="3" rx="10" />
        <rect x="-140" y="530" width="250" height="20" fill="#4b5563" rx="8" />
        <text x="-50" y="500" fontSize="16" fill="#cf0c30ff" fontWeight="bold">Main Conveyor</text>

        {/* Color conveyors (branch at x=250, y=430) */}
        <line x1="100" y1="540" x2="430" y2="175" stroke="#ef4444" strokeWidth="8" opacity="0.7" />
        <line x1="100" y1="540" x2="430" y2="540" stroke="#3b82f6" strokeWidth="8" opacity="0.7" />
        <line x1="100" y1="540" x2="430" y2="900" stroke="#10b981" strokeWidth="8" opacity="0.7" />
        <text x="200" y="300" fontSize="14" fill="#ef4444" fontWeight="bold">Red Parts</text>
        <text x="200" y="520" fontSize="14" fill="#3b82f6" fontWeight="bold">Blue Parts</text>
        <text x="200" y="780" fontSize="14" fill="#10b981" fontWeight="bold">Green Parts</text>

        {/* Shape conveyors (3 for each color, branch at x=600) */}
        {/* Red */}
        <line x1="430" y1="175" x2="800" y2="60" stroke="#ef4444" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="175" x2="800" y2="180" stroke="#ef4444" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="175" x2="800" y2="300" stroke="#ef4444" strokeWidth="6" opacity="0.7" />
        <text x="600" y="90" fontSize="12" fill="#ef4444">Circle</text>
        <text x="600" y="160" fontSize="12" fill="#ef4444">Square</text>
        <text x="600" y="280" fontSize="12" fill="#ef4444">Triangle</text>
        {/* Blue */}
        <line x1="430" y1="540" x2="800" y2="420" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="540" x2="800" y2="540" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="540" x2="800" y2="660" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
        <text x="600" y="450" fontSize="12" fill="#3b82f6">Circle</text>
        <text x="600" y="520" fontSize="12" fill="#3b82f6">Square</text>
        <text x="600" y="640" fontSize="12" fill="#3b82f6">Triangle</text>
        {/* Green */}
        <line x1="430" y1="900" x2="800" y2="780" stroke="#10b981" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="900" x2="800" y2="900" stroke="#10b981" strokeWidth="6" opacity="0.7" />
        <line x1="430" y1="900" x2="800" y2="1020" stroke="#10b981" strokeWidth="6" opacity="0.7" />
        <text x="600" y="810" fontSize="12" fill="#10b981">Circle</text>
        <text x="600" y="890" fontSize="12" fill="#10b981">Square</text>
        <text x="600" y="1010" fontSize="12" fill="#10b981">Triangle</text>

        {/* Size conveyors (3 for each shape, branch at x=1000) */}
        {/* Red-Circle */}
        <line x1="800" y1="60" x2="1150" y2="20" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="60" x2="1150" y2="60" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="60" x2="1150" y2="100" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="20" fontSize="10" fill="#ef4444">Red Circle Sm</text>
        <text x="1175" y="60" fontSize="10" fill="#ef4444">Red Circle Med</text>
        <text x="1175" y="100" fontSize="10" fill="#ef4444">Red Circle Lg</text>
        {/* Red-Square */}
        <line x1="800" y1="180" x2="1150" y2="140" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="180" x2="1150" y2="180" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="180" x2="1150" y2="220" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="140" fontSize="10" fill="#ef4444">Red Square Sm</text>
        <text x="1175" y="180" fontSize="10" fill="#ef4444">Red Square Med</text>
        <text x="1175" y="220" fontSize="10" fill="#ef4444">Red Square Lg</text>
        {/* Red-Triangle */}
        <line x1="800" y1="300" x2="1150" y2="260" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="300" x2="1150" y2="300" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="300" x2="1150" y2="340" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="260" fontSize="10" fill="#ef4444">Red Triangle Sm</text>
        <text x="1175" y="300" fontSize="10" fill="#ef4444">Red Triangle Med</text>
        <text x="1175" y="340" fontSize="10" fill="#ef4444">Red Triangle Lg</text>
        {/* Blue-Circle */}
        <line x1="800" y1="420" x2="1150" y2="380" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="420" x2="1150" y2="420" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="420" x2="1150" y2="460" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="380" fontSize="10" fill="#3b82f6">Blue Circle Sm</text>
        <text x="1175" y="420" fontSize="10" fill="#3b82f6">Blue Circle Med</text>
        <text x="1175" y="460" fontSize="10" fill="#3b82f6">Blue Circle Lg</text>
        {/* Blue-Square */}
        <line x1="800" y1="540" x2="1150" y2="500" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="540" x2="1150" y2="540" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="540" x2="1150" y2="580" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="500" fontSize="10" fill="#3b82f6">Blue Square Sm</text>
        <text x="1175" y="540" fontSize="10" fill="#3b82f6">Blue Square Med</text>
        <text x="1175" y="580" fontSize="10" fill="#3b82f6">Blue Square Lg</text>
        {/* Blue-Triangle */}
        <line x1="800" y1="660" x2="1150" y2="620" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="660" x2="1150" y2="660" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="660" x2="1150" y2="700" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="620" fontSize="10" fill="#3b82f6">Blue Triangle Sm</text>
        <text x="1175" y="660" fontSize="10" fill="#3b82f6">Blue Triangle Med</text>
        <text x="1175" y="700" fontSize="10" fill="#3b82f6">Blue Triangle Lg</text>
        {/* Green-Circle */}
        <line x1="800" y1="780" x2="1150" y2="740" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="780" x2="1150" y2="780" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="780" x2="1150" y2="820" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="740" fontSize="10" fill="#10b981">Green Circle Sm</text>
        <text x="1175" y="780" fontSize="10" fill="#10b981">Green Circle Med</text>
        <text x="1175" y="820" fontSize="10" fill="#10b981">Green Circle Lg</text>
        {/* Green-Square */}
        <line x1="800" y1="900" x2="1150" y2="860" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="900" x2="1150" y2="900" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="900" x2="1150" y2="940" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="860" fontSize="10" fill="#10b981">Green Square Sm</text>
        <text x="1175" y="900" fontSize="10" fill="#10b981">Green Square Med</text>
        <text x="1175" y="940" fontSize="10" fill="#10b981">Green Square Lg</text>
        {/* Green-Triangle */}
        <line x1="800" y1="1020" x2="1150" y2="980" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="1020" x2="1150" y2="1020" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="1020" x2="1150" y2="1060" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <text x="1175" y="980" fontSize="10" fill="#10b981">Green Triangle Sm</text>
        <text x="1175" y="1020" fontSize="10" fill="#10b981">Green Triangle Med</text>
        <text x="1175" y="1060" fontSize="10" fill="#10b981">Green Triangle Lg</text>
        {/* End lane counters for all 27 stations, spaced closer together */}
        {/* Example for a few, repeat for all 27 */}
        
        <g>
          {/* <rect x="1170" y="0" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="20" fontSize="15" fill="#b45309" fontWeight="bold">{counters[0]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="35" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="60" fontSize="15" fill="#b45309" fontWeight="bold">{counters[1]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="70" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="100" fontSize="15" fill="#b45309" fontWeight="bold">{counters[2]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="105" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="140" fontSize="15" fill="#b45309" fontWeight="bold">{counters[3]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="140" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="180" fontSize="15" fill="#b45309" fontWeight="bold">{counters[4]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="175" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="220" fontSize="15" fill="#b45309" fontWeight="bold">{counters[5]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="210" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="260" fontSize="15" fill="#b45309" fontWeight="bold">{counters[6]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="245" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="300" fontSize="15" fill="#b45309" fontWeight="bold">{counters[7]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="280" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="340" fontSize="15" fill="#b45309" fontWeight="bold">{counters[8]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="315" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="380" fontSize="15" fill="#b45309" fontWeight="bold">{counters[9]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="350" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="420" fontSize="15" fill="#b45309" fontWeight="bold">{counters[10]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="385" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="460" fontSize="15" fill="#b45309" fontWeight="bold">{counters[11]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="420" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="500" fontSize="15" fill="#b45309" fontWeight="bold">{counters[12]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="455" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="540" fontSize="15" fill="#b45309" fontWeight="bold">{counters[13]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="490" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="580" fontSize="15" fill="#b45309" fontWeight="bold">{counters[14]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="525" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="620" fontSize="15" fill="#b45309" fontWeight="bold">{counters[15]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="560" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="660" fontSize="15" fill="#b45309" fontWeight="bold">{counters[16]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="595" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="700" fontSize="15" fill="#b45309" fontWeight="bold">{counters[17]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="630" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="740" fontSize="15" fill="#b45309" fontWeight="bold">{counters[18]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="665" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="780" fontSize="15" fill="#b45309" fontWeight="bold">{counters[19]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="700" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="820" fontSize="15" fill="#b45309" fontWeight="bold">{counters[20]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="735" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="860" fontSize="15" fill="#b45309" fontWeight="bold">{counters[21]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="770" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="900" fontSize="15" fill="#b45309" fontWeight="bold">{counters[22]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="805" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="940" fontSize="15" fill="#b45309" fontWeight="bold">{counters[23]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="840" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="980" fontSize="15" fill="#b45309" fontWeight="bold">{counters[24]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="875" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="1020" fontSize="15" fill="#b45309" fontWeight="bold">{counters[25]}</text>
        </g>
        <g>
          {/* <rect x="1170" y="910" width="24" height="16" rx="5" fill="#fff" stroke="#b45309" strokeWidth="2" /> */}
          <text x="1150" y="1060" fontSize="15" fill="#b45309" fontWeight="bold">{counters[26]}</text>
        </g>

        {/* Parts on Conveyor, following sorting paths */}
        {parts.map(part => {
          const size = getPartSize(part.size) * 2;
          // Calculate x/y for each phase using the new animation logic
          let x = -140, y = 540;
          if (part.phase === 0) {
            x = -140 + 240 * part.progress;
            y = 540;
          } else if (part.phase === 1) {
            if (part.color === '#ef4444') {
              x = 100 + 330 * part.progress;
              y = 540 + (175-540) * part.progress;
            } else if (part.color === '#3b82f6') {
              x = 100 + 330 * part.progress;
              y = 540;
            } else if (part.color === '#10b981') {
              x = 100 + 330 * part.progress;
              y = 540 + (900-540) * part.progress;
            }
          } else if (part.phase === 2) {
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') {
                x = 430 + 370 * part.progress;
                y = 175 + (60-175) * part.progress;
              } else if (part.shape === 'square') {
                x = 430 + 370 * part.progress;
                y = 175 + (180-175) * part.progress;
              } else {
                x = 430 + 370 * part.progress;
                y = 175 + (300-175) * part.progress;
              }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') {
                x = 430 + 370 * part.progress;
                y = 540 + (420-540) * part.progress;
              } else if (part.shape === 'square') {
                x = 430 + 370 * part.progress;
                y = 540;
              } else {
                x = 430 + 370 * part.progress;
                y = 540 + (660-540) * part.progress;
              }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') {
                x = 430 + 370 * part.progress;
                y = 900 + (780-900) * part.progress;
              } else if (part.shape === 'square') {
                x = 430 + 370 * part.progress;
                y = 900;
              } else {
                x = 430 + 370 * part.progress;
                y = 900 + (1020-900) * part.progress;
              }
            }
          } else if (part.phase === 3) {
            // Red
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 60 + (20-60) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 60;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 60 + (100-60) * part.progress;
                }
              } else if (part.shape === 'square') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 180 + (140-180) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 180;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 180 + (220-180) * part.progress;
                }
              } else {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 300 + (260-300) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 300;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 300 + (340-300) * part.progress;
                }
              }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 420 + (380-420) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 420;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 420 + (460-420) * part.progress;
                }
              } else if (part.shape === 'square') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 540 + (500-540) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 540;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 540 + (580-540) * part.progress;
                }
              } else {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 660 + (620-660) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 660;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 660 + (700-660) * part.progress;
                }
              }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 780 + (740-780) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 780;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 780 + (820-780) * part.progress;
                }
              } else if (part.shape === 'square') {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 900 + (860-900) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 900;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 900 + (940-900) * part.progress;
                }
              } else {
                if (part.size === 'small') {
                  x = 800 + 350 * part.progress;
                  y = 1020 + (980-1020) * part.progress;
                } else if (part.size === 'medium') {
                  x = 800 + 350 * part.progress;
                  y = 1020;
                } else {
                  x = 800 + 350 * part.progress;
                  y = 1020 + (1060-1020) * part.progress;
                }
              }
            }
          }
          return (
            <g key={part.id} transform={`translate(${x}, ${y - size / 2})`}>
              {part.shape === 'circle' && (
                <circle cx={size/2} cy={size/2} r={size/2} fill={part.color} stroke="#fff" strokeWidth="2" />
              )}
              {part.shape === 'square' && (
                <rect x="0" y="0" width={size} height={size} fill={part.color} stroke="#fff" strokeWidth="2" />
              )}
              {part.shape === 'triangle' && (
                <polygon 
                  points={`${size/2},0 ${size},${size} 0,${size}`} 
                  fill={part.color} 
                  stroke="#fff" 
                  strokeWidth="2" 
                />
              )}
            </g>
          );
        })}

        {/* Labels */}
        <text x="200" y="50" textAnchor="middle" fill="#22d3ee" fontSize="36" fontWeight="bold">
          Conveyor Sorting System
        </text>
        <text x="200" y="90" textAnchor="middle" fill="#9ca3af" fontSize="22">
          Speed: {parameters.speed}% | Parts on Belt: {parts.length} | Total Parts: {counters.reduce((a, b) => a + b, 0)}
        </text>
      </svg>
    </div>
  );
};

export default ConveyorSortingSystem;