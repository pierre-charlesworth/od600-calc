import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

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
  const formatOptions = unit === 'µL'
    ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
    : { minimumFractionDigits: 3, maximumFractionDigits: 3 };

  const formattedValue = value.toLocaleString(undefined, formatOptions);
  const zeroValue = unit === 'µL' ? '0.0' : '0.000';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-white font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
            OD<sub className="text-2xl sm:text-3xl">600</sub> Dilution Calculator
          </h1>
          <p className="text-slate-400 mt-2">
            Calculate volumes for bacterial culture dilutions.
          </p>
        </header>

        <main className="bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
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

          <div className="mt-8 pt-6 border-t border-slate-700">
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
                <ResultDisplay
                  label="Culture to Add"
                  value={cultureDisplayValue}
                  unit={cultureDisplayUnit}
                />
                <ResultDisplay
                  label="Media to Add"
                  value={mediaVolume}
                  unit="mL"
                />
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Built for the modern lab.</p>
        </footer>
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