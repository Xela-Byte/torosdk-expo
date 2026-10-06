import React from 'react';
import { CodeBlock } from './CodeBlock';

interface TryItLabProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  codeSnippet: string;
}

export function TryItLab({ title, description, codeSnippet }: TryItLabProps) {
  return (
    <div className="mt-12 rounded-2xl border border-white/10 overflow-hidden bg-[#000000] shadow-2xl">
      <div className="border-b border-white/10 bg-[#080808] p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
            <svg className="w-4 h-4 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex bg-[#111111] rounded p-1 border border-white/5">
          <span className="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Code Example
          </span>
        </div>
      </div>
      <div className="p-6 bg-[#000000]">
        <CodeBlock code={codeSnippet} language="tsx" />
      </div>
    </div>
  );
}
