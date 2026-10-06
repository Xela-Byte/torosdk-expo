'use client';
import { useState, useEffect } from 'react';
import { tsToJs } from '../lib/tsToJs';

// Import highlight.js core + languages we need
import hljs from 'highlight.js/lib/core';
import tsx from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('typescript', tsx);
hljs.registerLanguage('tsx', tsx);
hljs.registerLanguage('jsx', tsx);
hljs.registerLanguage('javascript', tsx);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);

export interface CodeVariant {
  label: string;
  code: string;
  language: string;
}

interface CodeBlockProps {
  /** Pass a single code string (TypeScript by default — JS tab is auto-generated) */
  code?: string;
  language?: string;
  /** Or pass explicit variants for full control */
  variants?: CodeVariant[];
  /** Set false to suppress the auto JS tab */
  showJsTab?: boolean;
}

export function CodeBlock({ code, language = 'tsx', variants, showJsTab = true }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<string[]>([]);

  // Build variant list
  const tabs: CodeVariant[] = variants ?? [
    { label: 'TypeScript', code: code ?? '', language },
    ...(showJsTab && code ? [{ label: 'JavaScript', code: tsToJs(code), language: language === 'bash' ? 'bash' : 'jsx' }] : []),
  ];

  useEffect(() => {
    const results = tabs.map((tab) => {
      try {
        const lang = hljs.getLanguage(tab.language) ? tab.language : 'typescript';
        return hljs.highlight(tab.code, { language: lang }).value;
      } catch {
        return tab.code;
      }
    });
    setHighlighted(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, code, JSON.stringify(variants)]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab]?.code ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 my-4 bg-[#0d1117]">
      {/* Top bar */}
      <div className="flex items-center border-b border-white/10 bg-[#161b22]">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-white/5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Tabs (only show if > 1 tab) */}
        {tabs.length > 1 && (
          <div className="flex flex-1 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === i
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Language label (single tab) */}
        {tabs.length === 1 && (
          <span className="flex-1 text-center text-xs text-gray-500 font-mono py-2.5">
            {tabs[0]?.language}
          </span>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 mx-3 my-1.5"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-5 text-sm leading-relaxed overflow-x-auto hljs hide-scrollbar">
        <code
          className={`language-${tabs[activeTab]?.language} font-mono text-[13px]`}
          dangerouslySetInnerHTML={{ __html: highlighted[activeTab] ?? tabs[activeTab]?.code ?? '' }}
        />
      </pre>
    </div>
  );
}
