import React, { useState, useMemo } from 'react';
import InputControl from './components/InputControl.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';

interface CalculationResult {
  cultureVolume: number;
  mediaVolume: number;
  error: string | null;
}

function App() {
  const [cultureOd, setCultureOd] = useState<string>('');
  const [targetOd, setTargetOd] = useState<string>('');
  const [finalVolume, setFinalVolume] = useState<string>('');
  const [finalVolumeUnit, setFinalVolumeUnit] = useState<'mL' | 'L'>('mL');

  const calculationResult = useMemo((): CalculationResult => {
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
            />
            <InputControl
              id="target-od"
              label="Target OD₆₀₀"
              value={targetOd}
              onChange={(e) => setTargetOd(e.target.value)}
              placeholder="e.g., 0.1"
            />
            <InputControl
              id="final-volume"
              label="Final Volume"
              value={finalVolume}
              onChange={(e) => setFinalVolume(e.target.value)}
              placeholder="e.g., 50"
              unitSelector={
                <select
                  aria-label="Final volume unit"
                  value={finalVolumeUnit}
                  onChange={(e) => setFinalVolumeUnit(e.target.value as 'mL' | 'L')}
                  className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-8 text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm appearance-none"
                  style={{ backgroundImage: 'none' }} // Basic native arrow removal
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
                 Reset
               </button>
             </div>
            {error ? (
              <div className="flex items-center justify-center gap-2 bg-red-900/50 text-red-300 p-3 rounded-lg">
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

export default App;