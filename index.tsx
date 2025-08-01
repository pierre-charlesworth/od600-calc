import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './src/pwa';

// All components are defined in this single file for simplicity.

// --- ICONS ---

const FlaskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 3l6 0" />
    <path d="M10 9l4 0" />
    <path d="M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6" />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const BeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 3l12 0" />
    <path d="M6 3l-1.721 15.488a2.35 2.35 0 0 0 2.224 2.512h10.994a2.35 2.35 0 0 0 2.224 -2.512l-1.721 -15.488" />
    <path d="M9 11l6 0" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
    <polyline points="11 12 12 12 12 16 13 16" />
  </svg>
);

const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747" />
    <path d="M20 4v5h-5" />
  </svg>
);


// --- UI COMPONENTS ---
interface InputControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  iconComponent?: React.ReactNode;
  unit?: string;
  unitSelector?: React.ReactNode;
}


const InputControl: React.FC<InputControlProps> = ({ id, label, value, onChange, iconComponent, placeholder, unit, unitSelector }) => {
  const paddingRightClass = unitSelector ? 'pr-20' : unit ? 'pr-12' : 'pr-4';
  const paddingLeftClass = iconComponent ? 'pl-10' : 'pl-4';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {iconComponent && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-400">{iconComponent}</span>
          </div>
        )}
        <input
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full rounded-md border-0 bg-slate-700/50 py-3 ${paddingLeftClass} ${paddingRightClass} text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all`}
          min="0"
          step="any"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {unit && (
            <span className="pointer-events-none pr-3 text-slate-400 sm:text-sm">{unit}</span>
          )}
          {unitSelector}
        </div>
      </div>
    </div>
  );
};

interface ResultDisplayProps {
  label: string;
  value: number;
  unit: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, value, unit }) => {
  const formatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const formattedValue = value.toLocaleString(undefined, formatOptions);
  const zeroValue = '0.00';

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 text-center ring-1 ring-slate-700">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-cyan-400 tracking-tight">
        {value > 0 ? formattedValue : zeroValue}
      </p>
      <p className="text-sm text-slate-500">{unit}</p>
    </div>
  );
};


// --- GROWTH TIME ESTIMATOR ---
const speciesGrowthRates: Record<string, number> = {
  'E. coli': 2.0, // per hour
  'S. cerevisiae': 0.4,
  'B. subtilis': 1.2,
  'Custom': 1.0,
};

function GrowthTimeEstimator() {
  const [startTime, setStartTime] = useState('');
  const [startOd, setStartOd] = useState('');
  const [targetOd, setTargetOd] = useState('');
  const [species, setSpecies] = useState('E. coli');
  const [customRate, setCustomRate] = useState('1.0');

  // Calculate ETA
  const result = useMemo(() => {
    const od0 = parseFloat(startOd);
    const od1 = parseFloat(targetOd);
    let rate = species === 'Custom' ? parseFloat(customRate) : speciesGrowthRates[species];
    if (isNaN(od0) || isNaN(od1) || isNaN(rate) || od0 <= 0 || od1 <= od0 || rate <= 0) {
      return { eta: '', error: 'Enter valid values (target OD > start OD > 0, rate > 0)' };
    }
    // t = (ln(OD1) - ln(OD0)) / rate
    const hours = (Math.log(od1) - Math.log(od0)) / rate;
    if (!isFinite(hours) || hours < 0) return { eta: '', error: 'Check values' };
    if (!startTime) return { eta: hours.toFixed(2) + ' h', error: null };
    // Add hours to start time
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return { eta: hours.toFixed(2) + ' h', error: null };
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const etaDate = new Date(start.getTime() + hours * 60 * 60 * 1000);
    const etaStr = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { eta: etaStr + ` (${hours.toFixed(2)} h)`, error: null };
  }, [startTime, startOd, targetOd, species, customRate]);

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 mt-8">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Growth Time Estimator</h2>
      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="block w-full rounded-md border-0 bg-slate-700/50 py-3 pl-4 pr-4 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-all" />
          </div>
          <InputControl id="start-od" label="Starting OD" value={startOd} onChange={e => setStartOd(e.target.value)} placeholder="e.g., 0.1" iconComponent={<FlaskIcon />} />
          <InputControl id="target-od-growth" label="Target OD" value={targetOd} onChange={e => setTargetOd(e.target.value)} placeholder="e.g., 1.0" iconComponent={<TargetIcon />} />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Species</label>
            <select value={species} onChange={e => setSpecies(e.target.value)} className="block w-full rounded-md border-0 bg-slate-700/50 py-3 pl-4 pr-4 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm">
              {Object.keys(speciesGrowthRates).map(sp => <option key={sp}>{sp}</option>)}
            </select>
          </div>
          {species === 'Custom' && (
            <InputControl id="custom-rate" label="Growth Rate (1/h)" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder="e.g., 0.7" />
          )}
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <div className="bg-slate-700/50 rounded-lg p-6 text-center ring-1 ring-slate-700 min-w-[180px]">
            <p className="text-sm font-medium text-slate-400 mb-2">Estimated Arrival Time</p>
            {result.error ? (
              <span className="text-red-400 font-medium">{result.error}</span>
            ) : (
              <span className="text-2xl font-semibold text-cyan-400 tracking-tight">{result.eta}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// --- MAIN APP COMPONENT ---

function App() {
  const [cultureOd, setCultureOd] = useState('');
  const [targetOd, setTargetOd] = useState('');
  const [finalVolume, setFinalVolume] = useState('');
  const [finalVolumeUnit, setFinalVolumeUnit] = useState<'mL' | 'L'>('mL');

  const calculationResult = useMemo(() => {
    const cultureOdNum = parseFloat(cultureOd);
    const targetOdNum = parseFloat(targetOd);
    const finalVolumeNum = parseFloat(finalVolume);

    if (isNaN(cultureOdNum) || isNaN(targetOdNum) || isNaN(finalVolumeNum)) {
      return { cultureVolume: 0, mediaVolume: 0, error: null };
    }
    
    const finalVolumeInMl = finalVolumeUnit === 'L' ? finalVolumeNum * 1000 : finalVolumeNum;

    if (cultureOdNum <= 0 || targetOdNum <= 0 || finalVolumeInMl <= 0) {
      return { cultureVolume: 0, mediaVolume: 0, error: 'All values must be positive.' };
    }

    if (cultureOdNum <= targetOdNum) {
      return { cultureVolume: 0, mediaVolume: 0, error: 'Culture OD must be greater than Target OD.' };
    }

    const cultureVolume = (targetOdNum * finalVolumeInMl) / cultureOdNum;
    const mediaVolume = finalVolumeInMl - cultureVolume;

    return { cultureVolume, mediaVolume, error: null };
  }, [cultureOd, targetOd, finalVolume, finalVolumeUnit]);

  const { cultureVolume, mediaVolume, error } = calculationResult;

  const [cultureDisplayValue, cultureDisplayUnit] = useMemo(() => {
    if (cultureVolume > 0 && cultureVolume < 1) {
      return [cultureVolume * 1000, 'µL'];
    }
    return [cultureVolume, 'mL'];
  }, [cultureVolume]);

  const handleReset = () => {
    setCultureOd('');
    setTargetOd('');
    setFinalVolume('');
    setFinalVolumeUnit('mL');
  };

  // --- INSTALL PWA PROMPT HOOK ---

  function usePwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const install = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    };

    return { isVisible, install, hide: () => setIsVisible(false) };
  }

  const installPrompt = usePwaInstallPrompt();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-white font-sans">
      {/* PWA install banner */}
      {installPrompt.isVisible && (
        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-md bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <span className="text-sm">Install this app?</span>
          <div className="space-x-2">
            <button onClick={installPrompt.install} className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white text-sm">Install</button>
            <button onClick={installPrompt.hide} className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm">Close</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
            OD<sub className="text-2xl sm:text-3xl">600</sub> Dilution Calculator
          </h1>
          <p className="text-slate-400 mt-2">
            Calculate volumes for bacterial culture dilutions.
          </p>
        </header>

        <main className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="space-y-6">
              <InputControl
                id="culture-od"
                label="Culture OD₆₀₀"
                value={cultureOd}
                onChange={(e) => setCultureOd(e.target.value)}
                placeholder="e.g., 1.8"
                iconComponent={<FlaskIcon />}
              />
              <InputControl
                id="target-od"
                label="Target OD₆₀₀"
                value={targetOd}
                onChange={(e) => setTargetOd(e.target.value)}
                placeholder="e.g., 0.1"
                iconComponent={<TargetIcon />}
              />
              <InputControl
                id="final-volume"
                label="Final Volume"
                value={finalVolume}
                onChange={(e) => setFinalVolume(e.target.value)}
                placeholder="e.g., 50"
                iconComponent={<BeakerIcon />}
                unitSelector={
                  <select
                    aria-label="Final volume unit"
                    value={finalVolumeUnit}
                    onChange={(e) => setFinalVolumeUnit(e.target.value as 'mL' | 'L')}
                    className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-8 text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm appearance-none"
                    style={{ backgroundImage: 'none' }}
                  >
                    <option className="bg-slate-900 text-white">mL</option>
                    <option className="bg-slate-900 text-white">L</option>
                  </select>
                }
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-300">Results</h2>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                  aria-label="Reset fields"
                >
                  <ResetIcon />
                  Reset
                </button>
              </div>
              {error ? (
                <div className="flex items-center justify-center gap-2 bg-red-900/50 text-red-300 p-3 rounded-lg">
                  <InfoIcon />
                  <span className="font-medium">{error}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ResultDisplay label="Culture to Add" value={cultureDisplayValue} unit={cultureDisplayUnit} />
                  <ResultDisplay label="Media to Add" value={mediaVolume} unit="mL" />
                </div>
              )}
            </div>
          </div>
        </main>
        
        <GrowthTimeEstimator />
      </div>
    </div>
  );
}


// --- RENDER THE APP ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add type for BeforeInstallPromptEvent for TS strictness
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string[] }>;
  }
}