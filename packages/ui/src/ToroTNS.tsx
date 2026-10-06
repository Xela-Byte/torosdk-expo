import React, { useState } from 'react';
import { useToroTNSLookup, useToroTNSResolve } from '@reactforge/react';

export interface ToroTNSProps {
  className?: string;
  defaultMode?: 'resolve' | 'lookup';
}

export const ToroTNS: React.FC<ToroTNSProps> = ({ className = '', defaultMode = 'resolve' }) => {
  const [mode, setMode] = useState<'resolve' | 'lookup'>(defaultMode);
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');

  // Simple debounce for typing
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 500);
    return () => clearTimeout(timer);
  }, [input]);

  const { data: addressData, loading: resolveLoading, error: resolveError } = useToroTNSResolve(
    mode === 'resolve' ? debouncedInput : undefined
  );
  
  const { data: nameData, loading: lookupLoading, error: lookupError } = useToroTNSLookup(
    mode === 'lookup' ? debouncedInput : undefined
  );

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm max-w-md ${className}`}>
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
        <button
          className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${mode === 'resolve' ? 'bg-white shadow-sm font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setMode('resolve'); setInput(''); setDebouncedInput(''); }}
        >
          Name to Address
        </button>
        <button
          className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${mode === 'lookup' ? 'bg-white shadow-sm font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setMode('lookup'); setInput(''); setDebouncedInput(''); }}
        >
          Address to Name
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {mode === 'resolve' ? 'TNS Name (e.g. alice)' : 'Toronet Address'}
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={mode === 'resolve' ? 'Enter username...' : '0x...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="min-h-[3rem] p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
        {mode === 'resolve' && (
          <>
            {resolveLoading && <span className="text-sm text-gray-500 animate-pulse">Resolving...</span>}
            {resolveError && <span className="text-sm text-red-500">Name not found</span>}
            {!resolveLoading && !resolveError && addressData && (
              <div className="flex flex-col w-full">
                <span className="text-xs text-gray-500 mb-1">Resolved Address:</span>
                <span className="text-sm font-mono font-medium break-all">{addressData}</span>
              </div>
            )}
            {!resolveLoading && !resolveError && !addressData && debouncedInput && (
              <span className="text-sm text-gray-400">Type a complete name...</span>
            )}
          </>
        )}
        
        {mode === 'lookup' && (
          <>
            {lookupLoading && <span className="text-sm text-gray-500 animate-pulse">Looking up...</span>}
            {lookupError && <span className="text-sm text-red-500">No name found for address</span>}
            {!lookupLoading && !lookupError && nameData && (
              <div className="flex flex-col w-full items-center text-center">
                <span className="text-xs text-gray-500 mb-1">TNS Name:</span>
                <span className="text-lg font-bold text-gray-900">{nameData}</span>
              </div>
            )}
            {!lookupLoading && !lookupError && !nameData && debouncedInput && (
              <span className="text-sm text-gray-400">Enter a valid address...</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
