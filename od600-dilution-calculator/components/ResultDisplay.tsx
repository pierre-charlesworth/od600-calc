import React from 'react';

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

export default ResultDisplay;