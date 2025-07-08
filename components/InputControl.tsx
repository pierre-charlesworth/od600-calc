import React from 'react';

interface InputControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  iconComponent?: React.ReactNode;
  placeholder: string;
  unit?: string;
  unitSelector?: React.ReactNode;
}

const InputControl: React.FC<InputControlProps> = ({
  id,
  label,
  value,
  onChange,
  iconComponent,
  placeholder,
  unit,
  unitSelector,
}) => {
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

export default InputControl;