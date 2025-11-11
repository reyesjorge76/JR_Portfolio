
import React, { useState, useEffect } from 'react';
// For animating the pipe fill during loading
// (must be inside the component, not before imports)

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
  // For animating the pipe fill during loading
  const [loadingAnim, setLoadingAnim] = useState(0);
  // HMI/Recipe panel state and handlers (must be first)
  const [weights, setWeights] = useState({
    tank1: 20,
    tank2: 20,
    tank3: 10,
    tank4: 10,
  });
  // Mixer speed is now fixed for animation
  const [mixerSpeed, setMixerSpeed] = useState(60);
  const [mixTime, setMixTime] = useState(45); // seconds, max 120
  const [pressureLimit, setPressureLimit] = useState(parameters.pressure || 2.5);
  const [tempLimit, setTempLimit] = useState(parameters.temperature || 25);

  const handleWeightChange = (tank: string, value: number) => {
    setWeights(w => ({ ...w, [tank]: Math.max(0, value) }));
  };
  // Removed handleSpeedChange, speed is fixed
  const handleMixTimeChange = (value: number) => setMixTime(Math.max(1, Math.min(120, value)));
  const handlePressureChange = (value: number) => setPressureLimit(Math.max(0, value));
  const handleTempChange = (value: number) => setTempLimit(Math.max(0, value));

  // Four supply tanks
  const [levels, setLevels] = useState({
    tank1: 85,
    tank2: 75,
    tank3: 65,
    tank4: 55,
    mixer: 20,
    quality: 20
  });
  const [mixerRotation, setMixerRotation] = useState(0);
  // Pump states
  const [pump1Active, setPump1Active] = useState(false);
  const [pump2Active, setPump2Active] = useState(false);
  const [pump3Active, setPump3Active] = useState(false);
  const [pump4Active, setPump4Active] = useState(false);
  const [pumpToQualityActive, setPumpToQualityActive] = useState(false);

  // Sequential batch process state
  const [processStep, setProcessStep] = useState<'idle'|'loading'|'mixing'|'transfer'|'done'>('idle');
  const [batchWeights, setBatchWeights] = useState({tank1:0, tank2:0, tank3:0, tank4:0});
  const [mixTimeLeft, setMixTimeLeft] = useState(0);
  // Simulated real-time temp/pressure
  const [actualTemp, setActualTemp] = useState(22); // Start at room temp
  const [actualPressure, setActualPressure] = useState(1.0); // Start at atmospheric
  // Start process handler
  const handleStartProcess = () => {
    if (processStep !== 'idle' && processStep !== 'done') return;
    // Check tanks have enough for requested weights
    if (
      levels.tank1 < weights.tank1 ||
      levels.tank2 < weights.tank2 ||
      levels.tank3 < weights.tank3 ||
      levels.tank4 < weights.tank4
    ) {
      alert('Not enough material in one or more tanks!');
      return;
    }
    setProcessStep('loading');
  };

  // Stop and Reset handlers
  const handleStop = () => {
    if (processStep !== 'idle' && processStep !== 'done') setProcessStep('idle');
  };
  const handleReset = () => {
    setProcessStep('idle');
    setMixTimeLeft(0);
    setBatchWeights({tank1:0, tank2:0, tank3:0, tank4:0});
    setLevels({
      tank1: 85,
      tank2: 75,
      tank3: 65,
      tank4: 55,
      mixer: 0,
      quality: 20
    });
  };

  // Process step logic

  // --- New Batch Process Logic ---
  // Simulate real-time temp/pressure drift during mixing
  useEffect(() => {
    let tempInterval: NodeJS.Timeout | null = null;
    let pressureInterval: NodeJS.Timeout | null = null;
    if (processStep === 'mixing') {
      tempInterval = setInterval(() => {
        setActualTemp(t => {
          if (t >= tempLimit - 0.05) {
            // Jitter around target
            const jitter = (Math.random() - 0.5) * 0.08;
            let next = tempLimit + jitter;
            next = Math.round(next * 100) / 100;
            return next;
          }
          // Ramp up smoothly
          const step = Math.max(0.02, (tempLimit - 22) / 40); // reach in ~8s
          let next = t + step + (Math.random() - 0.5) * 0.03;
          if (next > tempLimit) next = tempLimit;
          next = Math.round(next * 100) / 100;
          return next;
        });
      }, 200);
      // Pressure ramps up from 1.0 to pressureLimit smoothly
      pressureInterval = setInterval(() => {
        setActualPressure(p => {
          // If already at or above target, just jitter around target
          if (p >= pressureLimit - 0.01) {
            const jitter = (Math.random() - 0.5) * 0.04;
            let next = pressureLimit + jitter;
            next = Math.max(0, Math.round(next * 100) / 100);
            return next;
          }
          // Ramp up smoothly
          const step = Math.max(0.01, (pressureLimit - 1.0) / 40); // reach in ~8s
          let next = p + step + (Math.random() - 0.5) * 0.01;
          if (next > pressureLimit) next = pressureLimit;
          next = Math.max(0, Math.round(next * 100) / 100);
          return next;
        });
      }, 200);
    } else {
      setActualTemp(22); // Reset to room temp when not mixing
      setActualPressure(1.0); // Reset to atmospheric when not mixing
    }
    return () => {
      if (tempInterval) clearInterval(tempInterval);
      if (pressureInterval) clearInterval(pressureInterval);
    };
  }, [processStep, tempLimit, pressureLimit]);

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout | null = null;
    let mixingTimer: NodeJS.Timeout | null = null;
    let transferTimer: NodeJS.Timeout | null = null;
    let animFrame: NodeJS.Timeout | null = null;

    if (processStep === 'loading') {
      setLoadingAnim(0);
      // Animate loading
      const animate = () => {
        setLoadingAnim(a => (a + 1) % 1000);
        animFrame = setTimeout(animate, 50);
      };
      animate();

      // Animate tank levels and mixer fill
  const duration = 2000; // ms
  const steps = 40;
      const interval = duration / steps;
      let currentStep = 0;
      const tankStart = { ...levels };
      // Calculate max possible dispense for each tank
      const maxDispense = {
        tank1: Math.min(weights.tank1, tankStart.tank1),
        tank2: Math.min(weights.tank2, tankStart.tank2),
        tank3: Math.min(weights.tank3, tankStart.tank3),
        tank4: Math.min(weights.tank4, tankStart.tank4)
      };
      const totalDispense = maxDispense.tank1 + maxDispense.tank2 + maxDispense.tank3 + maxDispense.tank4;
      const tankEnd = {
        tank1: tankStart.tank1 - maxDispense.tank1,
        tank2: tankStart.tank2 - maxDispense.tank2,
        tank3: tankStart.tank3 - maxDispense.tank3,
        tank4: tankStart.tank4 - maxDispense.tank4,
        mixer: Math.min(100, tankStart.mixer + totalDispense),
        quality: tankStart.quality
      };
      loadingTimer = setInterval(() => {
        currentStep++;
        setLevels(prev => {
          const progress = Math.min(currentStep / steps, 1);
          return {
            tank1: Math.max(0, tankStart.tank1 - (maxDispense.tank1 * progress)),
            tank2: Math.max(0, tankStart.tank2 - (maxDispense.tank2 * progress)),
            tank3: Math.max(0, tankStart.tank3 - (maxDispense.tank3 * progress)),
            tank4: Math.max(0, tankStart.tank4 - (maxDispense.tank4 * progress)),
            mixer: Math.min(100, tankStart.mixer + (totalDispense * progress)),
            quality: tankStart.quality
          };
        });
        if (currentStep >= steps) {
          clearInterval(loadingTimer!);
          setBatchWeights(maxDispense);
          setMixTimeLeft(mixTime);
          setTimeout(() => setProcessStep('mixing'), 0);
        }
      }, interval);
      return () => { if (animFrame) clearTimeout(animFrame); if (loadingTimer) clearInterval(loadingTimer); };
    }

    if (processStep === 'mixing' && levels.mixer > 0 && mixTimeLeft > 0) {
      mixingTimer = setInterval(() => {
        setMixTimeLeft(t => {
          if (t <= 1) {
            setProcessStep('transfer');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (mixingTimer) clearInterval(mixingTimer); };
    }
    // Transfer to Quality Check
    if (processStep === 'transfer' && levels.mixer > 0) {
      setPumpToQualityActive(true);
      const duration = 4000; // ms (slower transfer)
      const steps = 80; // more steps for smoothness
      const interval = duration / steps;
      let currentStep = 0;
      const mixerStart = levels.mixer;
      const qualityStart = levels.quality;
      transferTimer = setInterval(() => {
        currentStep++;
        setLevels(prev => {
          const progress = Math.min(currentStep / steps, 1);
          return {
            ...prev,
            mixer: Math.max(0, mixerStart * (1 - progress)),
            quality: Math.min(100, qualityStart + mixerStart * progress)
          };
        });
        if (currentStep >= steps) {
          clearInterval(transferTimer!);
          setProcessStep('done');
          setPumpToQualityActive(false);
        }
      }, interval);
      return () => { if (transferTimer) clearInterval(transferTimer); };
    }

    if (processStep === 'idle' || processStep === 'done') {
      setPumpToQualityActive(false);
    }

    return () => {
      if (animFrame) clearTimeout(animFrame);
      if (loadingTimer) clearTimeout(loadingTimer);
      if (mixingTimer) clearInterval(mixingTimer);
      if (transferTimer) clearTimeout(transferTimer);
    };
  }, [processStep, weights, mixTime, levels.mixer]);

  // Smooth mixer animation during mixing (always runs when processStep is 'mixing')
  useEffect(() => {
    let raf: number;
    const animate = () => {
      if (processStep !== 'idle' && processStep !== 'done' && levels.mixer >= 20) {
        setMixerRotation(prev => (prev + 6) % 360);
        raf = requestAnimationFrame(animate);
      }
    };
    if (processStep !== 'idle' && processStep !== 'done' && levels.mixer >= 20) {
      raf = requestAnimationFrame(animate);
    }
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [processStep, levels.mixer]);



  return (
    <div className="rounded-lg flex flex-col items-stretch">
      <div className="flex-1 min-w-0">
        <svg viewBox="-100 0 1000 800" className="w-full h-[200px] md:h-[800px]">
        {/* Four Supply Tanks, spaced horizontally at the top */}
        <g transform="translate(170, 60)">
          <rect x="0" y="0" width="80" height="140" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <rect x="5" y={140 - (levels.tank1 * 1.3)} width="70" height={levels.tank1 * 1.3} fill="#06b6d4" opacity={(processStep==='loading'||processStep==='mixing') ? 0.7 : 0.3} />
          <text x="40" y="-10" textAnchor="middle" fill="#06b6d4" fontSize="14">Raw Mat A</text>
          <text x="40" y="20" textAnchor="middle" fill="#ffffffff" fontSize="14">{levels.tank1.toFixed(0)}%</text>
        </g>
        <g transform="translate(310, 60)">
          <rect x="0" y="0" width="80" height="140" fill="none" stroke="#a855f7" strokeWidth="2" rx="5" />
          <rect x="5" y={140 - (levels.tank2 * 1.3)} width="70" height={levels.tank2 * 1.3} fill="#a855f7" opacity={(processStep==='loading'||processStep==='mixing') ? 0.7 : 0.3} />
          <text x="40" y="-10" textAnchor="middle" fill="#a855f7" fontSize="14">Raw Mat B</text>
          <text x="40" y="20" textAnchor="middle" fill="#ffffffff" fontSize="14">{levels.tank2.toFixed(0)}%</text>
        </g>
        <g transform="translate(450, 60)">
          <rect x="0" y="0" width="80" height="140" fill="none" stroke="#f59e42" strokeWidth="2" rx="5" />
          <rect x="5" y={140 - (levels.tank3 * 1.3)} width="70" height={levels.tank3 * 1.3} fill="#f59e42" opacity={(processStep==='loading'||processStep==='mixing') ? 0.7 : 0.3} />
          <text x="40" y="-10" textAnchor="middle" fill="#f59e42" fontSize="14">Raw Mat C</text>
          <text x="40" y="20" textAnchor="middle" fill="#ffffffff" fontSize="14">{levels.tank3.toFixed(0)}%</text>
        </g>
        {/* Powder Tank D with screw conveyor */}
        <g transform="translate(590, 60)">
          <rect x="0" y="0" width="80" height="140" fill="#f3f3f3" stroke="#f43f5e" strokeWidth="2" rx="5" />
          <rect x="5" y={140 - (levels.tank4 * 1.3)} width="70" height={levels.tank4 * 1.3} fill="#f43f5e" opacity={(processStep==='loading'||processStep==='mixing') ? 0.5 : 0.2} />
          <text x="40" y="-10" textAnchor="middle" fill="#f43f5e" fontSize="14">Powder D</text>
          <text x="40" y="20" textAnchor="middle" fill="#085ef3ff" fontSize="14">{levels.tank4.toFixed(0)}%</text>
          {/* Screw conveyor animation: only animate during loading */}
          {/* <g transform="translate(40, 140)">
            <rect x="-10" y="0" width="20" height="30" fill="#e5e7eb" stroke="#f43f5e" strokeWidth="2" rx="6" />
            <g>
              <ellipse cx="0" cy="15" rx="8" ry="8" fill="#f43f5e" opacity="0.5" />
              <rect x="-2" y="5" width="4" height="20" fill="#f43f5e" rx="2" transform={processStep==='loading'?`rotate(${mixerRotation*2})`:undefined} />
            </g>
            <rect x="-2" y="30" width="4" height="20" fill="#f43f5e" rx="2" />
          </g> */}
        </g>

        {/* Pipes: curve/angle from each tank to the top of the centered mixer */}
        <g>
          {/* Pipes: each tank curves directly to the top center of the mixer (x=520, y=320) */}
          <path d="M210,200 Q210,320 420,420" stroke="#06b6d4" strokeWidth="12" fill="none" opacity={processStep==='mixing'||processStep==='loading'?1:0.2} />
          <path d="M350,200 Q350,400 420,420" stroke="#a855f7" strokeWidth="12" fill="none" opacity={processStep==='mixing'||processStep==='loading'?1:0.2} />
          <path d="M490,200 Q490,400 420,420" stroke="#f59e42" strokeWidth="12" fill="none" opacity={processStep==='mixing'||processStep==='loading'?1:0.2} />
          <path d="M630,200 Q630,320 420,420" stroke="#f43f5e" strokeWidth="12" fill="none" opacity={processStep==='mixing'||processStep==='loading'?1:0.2} />
          {/* Animated transfer: show moving fill if loading */}
          {processStep==='loading' && (
            <>
              <circle cx={210 + (520-210)*(loadingAnim/1000)} cy={200 + (320-200)*(loadingAnim/1000)} r="10" fill="#06b6d4" opacity={0.7} />
              <circle cx={350 + (520-350)*(loadingAnim/1000)} cy={200 + (320-200)*(loadingAnim/1000)} r="10" fill="#a855f7" opacity={0.7} />
              <circle cx={490 + (520-490)*(loadingAnim/1000)} cy={200 + (320-200)*(loadingAnim/1000)} r="10" fill="#f59e42" opacity={0.7} />
              <circle cx={630 + (520-630)*(loadingAnim/1000)} cy={200 + (320-200)*(loadingAnim/1000)} r="10" fill="#f43f5e" opacity={0.7} />
            </>
          )}
        </g>

        {/* Mixer Vessel: centered under tanks */}
        <g>
        <g transform="translate(380, 420)">
          <ellipse cx="40" cy="0" rx="90" ry="60" fill="#22223b" stroke="#22d3ee" strokeWidth="4" />
          {/* Mixer fill ellipse, fills from bottom up */}
          <ellipse
            cx="40"
            cy={60 - (levels.mixer * 0.6)}
            rx="80"
            ry={Math.max(5, 50 * (levels.mixer / 100))}
            fill="#22d3ee"
            opacity="0.7"
            style={{ transition: 'cy 0.5s, ry 0.5s' }}
          />
          {/* Mixer Blades - rotate around (40,0) */}
          <g transform={`rotate(${mixerRotation},40,0)`}>
            <rect x="-20" y="-6" width="120" height="12" fill="#5c6060ff" rx="6" />
            <rect x="34" y="-60" width="12" height="120" fill="#5c6060ff" rx="6" />
          </g>
          <text x="40" y="-120" textAnchor="middle" fill="#22d3ee" fontSize="18" fontWeight="bold">Mixer</text>
          <text x="40" y="5" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">{levels.mixer.toFixed(0)}%</text>
          <text x="40" y="-100" textAnchor="middle" fill="#fbbf24" fontSize="13">Temp: {actualTemp.toFixed(1)}°C</text>
          <text x="40" y="-80" textAnchor="middle" fill="#4ade80" fontSize="13">Pressure: {actualPressure.toFixed(1)} bar</text>
          {processStep === 'mixing' && (
            <text x="40" y="-30" textAnchor="middle" fill="#fbbf24" fontSize="15" fontWeight="bold">
              Mixing: {mixTimeLeft}s
            </text>
          )}
        </g>
        </g>




        {/* Pipe and Pump to Quality Tank */}
        <g>
          <path d="M420,500 420,600" stroke="#10b981" strokeWidth="10" fill="none" opacity={pumpToQualityActive ? 0.7 : 0.2} />
          <g transform="translate(420,500)"><circle r="16" fill={pumpToQualityActive ? '#10b981' : '#374151'} stroke="#fff" strokeWidth="2" /><text x="-5" y="7" fontSize="16" fill="#fff">P</text></g>
        </g>

        {/* Quality Check Station */}
        <g transform="translate(420, 620)">
          <rect x="-40" y="0" width="80" height="120" fill="#18181b" stroke="#10b981" strokeWidth="3" rx="12" />
          <rect x="-30" y={120 - (levels.quality * 1.2)} width="60" height={levels.quality * 1.2} fill="#10b981" opacity="0.3" />
          <text x="0" y="-10" textAnchor="middle" fill="#10b981" fontSize="16">Quality Check</text>
          <text x="0" y="140" textAnchor="middle" fill="#9ca3af" fontSize="13">{levels.quality.toFixed(0)}%</text>
          <text x="0" y="160" textAnchor="middle" fill="#9ca3af" fontSize="12">Recipe: {parameters.recipe}</text>
          {/* QC Indicator */}
          <circle cx="0" cy="10" r="10" fill={levels.quality > 60 ? '#22c55e' : '#f43f5e'} stroke="#fff" strokeWidth="2" />
          <text x="0" y="16" textAnchor="middle" fontSize="14" fill="#fff">{levels.quality > 60 ? '✔' : '✖'}</text>
        </g>

        {/* Status Bar (removed buttons, now only status if needed) */}
        <g transform="translate(0, 440)">
          <rect x="0" y="-450" width="800" height="50" fill="#1f2937" rx="5" opacity="0.5" />
          <text x="350" y="-420" fill="#9ca3af" fontSize="16">
            Status: {
              processStep === 'idle' ? 'Idle'
              : processStep === 'loading' ? 'Loading'
              : processStep === 'mixing' ? 'Mixing'
              : processStep === 'transfer' ? 'Transferring to QC'
              : processStep === 'done' ? 'Done'
              : ''
            }
          </text>
        </g>

        </svg>
      </div>

      {/* Live Data Section below SVG */}
      <div className="w-full flex flex-wrap gap-8 justify-center items-center bg-gray-900 rounded-lg p-4 my-2 border border-gray-700 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-gray-400">Live Mixing Timer</span>
          <span className="text-yellow-300 font-mono text-lg">{processStep === 'mixing' ? `${mixTimeLeft}s` : '-'}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400">Actual Temp (°C)</span>
          <span className="text-red-300 font-mono text-lg">{actualTemp.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400">Actual Pressure (bar)</span>
          <span className="text-green-300 font-mono text-lg">{actualPressure.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400">Mixer Level (%)</span>
          <span className="text-cyan-300 font-mono text-lg">{levels.mixer.toFixed(0)}</span>
        </div>
      </div>

      {/* HMI/Parameter Panel below SVG, always scrollable if content overflows */}
      <style>{`
        @media (max-width: 600px) {
          .hmi-mobile-scroll {
            height: 100dvh !important;
            max-height: 100dvh !important;
            height: -webkit-fill-available !important;
            max-height: -webkit-fill-available !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            touch-action: pan-y !important;
            padding-bottom: 120px !important;
          }
        }
      `}</style>
      <div
  className="mt-2 bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row flex-wrap gap-4 shadow-lg w-full overflow-y-auto overflow-x-auto hmi-mobile-scroll"
  style={{ minHeight: 200, paddingBottom: 80 }}
      >
        <div className="flex flex-col gap-4 w-full flex-1 min-h-0">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-between w-full mb-2">
            <div className="flex flex-row gap-2">
              <button
                onClick={handleStartProcess}
                disabled={processStep !== 'idle' && processStep !== 'done'}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Start
              </button>
              <button
                onClick={handleStop}
                disabled={processStep === 'idle' || processStep === 'done'}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Stop
              </button>
              <button
                onClick={handleReset}
                disabled={processStep === 'idle'}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>
          {/* Recipe Section */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col gap-4 w-full border border-gray-700 overflow-y-auto" style={{maxHeight: '32vh'}}>
            <div className="text-lg font-semibold text-cyan-300 mb-2">Recipe Settings</div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Raw Mat A (Tank 1)</label>
                <input type="number" min="0" max="100" value={weights.tank1} onChange={e => handleWeightChange('tank1', Number(e.target.value))} className="bg-gray-800 border border-cyan-400 rounded px-2 py-1 text-cyan-200 w-24" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Raw Mat B (Tank 2)</label>
                <input type="number" min="0" max="100" value={weights.tank2} onChange={e => handleWeightChange('tank2', Number(e.target.value))} className="bg-gray-800 border border-purple-400 rounded px-2 py-1 text-purple-200 w-24" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Raw Mat C (Tank 3)</label>
                <input type="number" min="0" max="100" value={weights.tank3} onChange={e => handleWeightChange('tank3', Number(e.target.value))} className="bg-gray-800 border border-orange-400 rounded px-2 py-1 text-orange-200 w-24" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Powder D (Tank 4)</label>
                <input type="number" min="0" max="100" value={weights.tank4} onChange={e => handleWeightChange('tank4', Number(e.target.value))} className="bg-gray-800 border border-pink-400 rounded px-2 py-1 text-pink-200 w-24" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Mix Timer (sec)</label>
                <input type="number" min="1" max="120" value={mixTime} onChange={e => handleMixTimeChange(Number(e.target.value))} className="bg-gray-800 border border-yellow-400 rounded px-2 py-1 text-yellow-200 w-24" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Pressure (bar)</label>
                <input type="number" min="0" max="100" value={pressureLimit} onChange={e => handlePressureChange(Number(e.target.value))} className="bg-gray-800 border border-green-400 rounded px-2 py-1 text-green-200 w-24" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Temperature (°C)</label>
                <input type="number" min="0" max="200" value={tempLimit} onChange={e => handleTempChange(Number(e.target.value))} className="bg-gray-800 border border-red-400 rounded px-2 py-1 text-red-200 w-24" />
              </div>
            </div>
          </div>
          {/* ...existing HMI panel content... */}
        </div>
      </div>
    </div>
  );
}
export default BatteryMixingSystem;
