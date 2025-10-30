import React, { useState, useEffect } from 'react';

interface ConveyorSortingSystemProps {
  isRunning: boolean;
  parameters: {
    speed: number;
    temperature: number;
    pressure: number;
    recipe: string;
  };
}

interface Part {
  id: number;
  x: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: 'small' | 'medium' | 'large';
  sortedColor?: boolean;
  sortedShape?: boolean;
  sortedSize?: boolean;
  _y?: number; // animated y position for sorting conveyors
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

  useEffect(() => {
    let partTimer: NodeJS.Timeout | null = null;
    let moveTimer: NodeJS.Timeout | null = null;
    if (isRunning) {
      // Throttle part generation: add a new part every 2 seconds
      partTimer = setInterval(() => {
        const colors = ['#ef4444', '#3b82f6', '#10b981'];
        const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const newPart: Part = {
          id: nextId,
          x: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          size: sizes[Math.floor(Math.random() * sizes.length)]
        };
        setParts(prev => [...prev, newPart]);
        setNextId(prev => prev + 1);
      }, 2500); // timer for part creation... every 2.5 seconds

      // Move parts along conveyor every 100ms
      moveTimer = setInterval(() => {
        setParts(prev => {
          // Hierarchical sorting: color → shape → size
          return prev.map(part => {
            let { x, sortedColor, sortedShape, sortedSize } = part;
            let y = 540; // main conveyor y
            // COLOR sorting station at x=200
            if (!sortedColor && x >= 200) {
              if (part.color === '#ef4444') {
                y = 50;
                sortedColor = true;
              } else if (part.color === '#3b82f6') {
                y = 120;
                sortedColor = true;
              } else if (part.color === '#10b981') {
                y = 160;
                sortedColor = true;
              }
            } else if (sortedColor) {
              // Stay on color conveyor
              if (part.color === '#ef4444')  y = 80; 
              else if (part.color === '#3b82f6') y = 120;
              else if (part.color === '#10b981') y = 160;
            }
            // SHAPE sorting station at x=700 (on color lane)
            if (sortedColor && !sortedShape && x >= 200) {
              if (part.shape === 'circle') {
                y = (part.color === '#ef4444') ? 40 : (part.color === '#3b82f6') ? 80 : 120;
                sortedShape = true;
              } else if (part.shape === 'square') {
                y = (part.color === '#ef4444') ? 60 : (part.color === '#3b82f6') ? 100 : 140;
                sortedShape = true;
              } else if (part.shape === 'triangle') {
                y = (part.color === '#ef4444') ? 100 : (part.color === '#3b82f6') ? 140 : 180;
                sortedShape = true;
              }
            } else if (sortedShape) {
              // Stay on shape conveyor
              if (part.shape === 'circle') y = (part.color === '#ef4444') ? 40 : (part.color === '#3b82f6') ? 80 : 120;
              else if (part.shape === 'square') y = (part.color === '#ef4444') ? 60 : (part.color === '#3b82f6') ? 100 : 140;
              else if (part.shape === 'triangle') y = (part.color === '#ef4444') ? 100 : (part.color === '#3b82f6') ? 140 : 180;
            }
            // SIZE sorting station at x=600 (on shape lane)
            if (sortedShape && !sortedSize && x >= 600) {
              if (part.size === 'small') {
                y = (part.shape === 'circle') ? 20 : (part.shape === 'square') ? 30 : 40;
                sortedSize = true;
              } else if (part.size === 'medium') {
                y = (part.shape === 'circle') ? 60 : (part.shape === 'square') ? 70 : 80;
                sortedSize = true;
              } else if (part.size === 'large') {
                y = (part.shape === 'circle') ? 100 : (part.shape === 'square') ? 110 : 120;
                sortedSize = true;
              }
            } else if (sortedSize) {
              // Stay on size conveyor
              if (part.size === 'small') y = (part.shape === 'circle') ? 20 : (part.shape === 'square') ? 30 : 40;
              else if (part.size === 'medium') y = (part.shape === 'circle') ? 60 : (part.shape === 'square') ? 70 : 80;
              else if (part.size === 'large') y = (part.shape === 'circle') ? 100 : (part.shape === 'square') ? 110 : 120;
            }
            return {
              ...part,
              x: part.x + (parameters.speed / 10),
              _y: y,
              sortedColor,
              sortedShape,
              sortedSize
            };
          });
        });
        // Remove parts that reached the end and update counts
        setParts(prev => {
          const remaining = prev.filter(part => {
            if (part.x > 750) {
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
    <div className="flex justify-center items-center w-full h-[80vh] min-h-[600px] max-h-[900px] bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
      <svg viewBox="0 0 1100 1080" className="w-full h-full max-w-full max-h-full min-w-[700px] min-h-[500px]" preserveAspectRatio="xMidYMid meet">
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
        <text x="1175" y="13" fontSize="10" fill="#ef4444">Red Circle Sm</text>
        <text x="1175" y="48" fontSize="10" fill="#ef4444">Red Circle Med</text>
        <text x="1175" y="83" fontSize="10" fill="#ef4444">Red Circle Lg</text>
        {/* Red-Square */}
        <line x1="800" y1="180" x2="1150" y2="140" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="180" x2="1150" y2="180" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="180" x2="1150" y2="220" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        {/* Red-Triangle */}
        <line x1="800" y1="300" x2="1150" y2="260" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="300" x2="1150" y2="300" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="300" x2="1150" y2="340" stroke="#ef4444" strokeWidth="4" opacity="0.9" />
        {/* Blue-Circle */}
        <line x1="800" y1="420" x2="1150" y2="380" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="420" x2="1150" y2="420" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="420" x2="1150" y2="460" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        {/* Blue-Square */}
        <line x1="800" y1="540" x2="1150" y2="500" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="540" x2="1150" y2="540" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="540" x2="1150" y2="580" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        {/* Blue-Triangle */}
        <line x1="800" y1="660" x2="1150" y2="620" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="660" x2="1150" y2="660" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="660" x2="1150" y2="700" stroke="#3b82f6" strokeWidth="4" opacity="0.9" />
        {/* Green-Circle */}
        <line x1="800" y1="780" x2="1150" y2="740" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="780" x2="1150" y2="780" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="780" x2="1150" y2="820" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        {/* Green-Square */}
        <line x1="800" y1="900" x2="1150" y2="860" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="900" x2="1150" y2="900" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="900" x2="1150" y2="940" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        {/* Green-Triangle */}
        <line x1="800" y1="1020" x2="1150" y2="980" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="1020" x2="1150" y2="1020" stroke="#10b981" strokeWidth="4" opacity="0.9" />
        <line x1="800" y1="1020" x2="1150" y2="1060" stroke="#10b981" strokeWidth="4" opacity="0.9" />

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
          // Calculate x/y for each stage
          let x = 200 + part.x * 2;
          let y = 600;
          if (part.sortedColor) {
            if (part.color === '#ef4444') { x = 900 + (part.x-150)*2; y = 350; }
            else if (part.color === '#3b82f6') { x = 900 + (part.x-150)*2; y = 600; }
            else if (part.color === '#10b981') { x = 900 + (part.x-150)*2; y = 850; }
          }
          if (part.sortedShape) {
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') { x = 1400 + (part.x-350)*2; y = 200; }
              else if (part.shape === 'square') { x = 1400 + (part.x-350)*2; y = 350; }
              else if (part.shape === 'triangle') { x = 1400 + (part.x-350)*2; y = 500; }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') { x = 1400 + (part.x-350)*2; y = 450; }
              else if (part.shape === 'square') { x = 1400 + (part.x-350)*2; y = 600; }
              else if (part.shape === 'triangle') { x = 1400 + (part.x-350)*2; y = 750; }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') { x = 1400 + (part.x-350)*2; y = 700; }
              else if (part.shape === 'square') { x = 1400 + (part.x-350)*2; y = 850; }
              else if (part.shape === 'triangle') { x = 1400 + (part.x-350)*2; y = 1000; }
            }
          }
          if (part.sortedSize) {
            // Final size lane for each color/shape/size
            if (part.color === '#ef4444') {
              if (part.shape === 'circle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 100; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 200; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 300; }
              } else if (part.shape === 'square') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 350; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 450; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 550; }
              } else if (part.shape === 'triangle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 500; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 600; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 700; }
              }
            } else if (part.color === '#3b82f6') {
              if (part.shape === 'circle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 450; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 550; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 650; }
              } else if (part.shape === 'square') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 600; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 700; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 800; }
              } else if (part.shape === 'triangle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 750; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 850; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 950; }
              }
            } else if (part.color === '#10b981') {
              if (part.shape === 'circle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 700; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 800; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 900; }
              } else if (part.shape === 'square') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 850; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 950; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 1050; }
              } else if (part.shape === 'triangle') {
                if (part.size === 'small') { x = 2000 + (part.x-600)*2; y = 1000; }
                else if (part.size === 'medium') { x = 2000 + (part.x-600)*2; y = 1100; }
                else if (part.size === 'large') { x = 2000 + (part.x-600)*2; y = 1200; }
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
        <text x="250" y="50" textAnchor="middle" fill="#22d3ee" fontSize="36" fontWeight="bold">
          Conveyor Sorting System
        </text>
        <text x="200" y="90" textAnchor="middle" fill="#9ca3af" fontSize="22">
          Speed: {parameters.speed}% | Parts on Belt: {parts.length}
        </text>
      </svg>
    </div>
  );
};

export default ConveyorSortingSystem;