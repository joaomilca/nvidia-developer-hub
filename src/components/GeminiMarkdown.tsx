import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface GeminiMarkdownProps {
  content: string;
}

export const GeminiMarkdown: React.FC<GeminiMarkdownProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split content by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      const textChunk = content.substring(lastIndex, match.index);
      parts.push(
        <div key={`text-${lastIndex}`} className="space-y-2">
          {renderFormattedText(textChunk)}
        </div>
      );
    }

    const lang = match[1] || 'bash';
    const code = match[2].trim();
    const currentBlockIndex = blockIndex++;

    parts.push(
      <div 
        key={`code-${match.index}`} 
        className="my-3 rounded-lg overflow-hidden border border-[#243320] bg-[#0A0D0A]"
      >
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#121812] border-b border-[#1C2619] text-[11px] text-neutral-400 font-mono">
          <span className="uppercase font-semibold text-[#76B900]">{lang}</span>
          <button
            onClick={() => handleCopyCode(code, currentBlockIndex)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
            title="Copiar código"
          >
            {copiedIndex === currentBlockIndex ? (
              <>
                <Check className="w-3 h-3 text-[#76B900]" />
                <span className="text-[#76B900]">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3 text-[11.5px] font-mono leading-relaxed overflow-x-auto text-neutral-200 selection:bg-[#76B900] selection:text-black">
          <code>{code}</code>
        </pre>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add trailing text
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex);
    parts.push(
      <div key={`text-${lastIndex}`} className="space-y-2">
        {renderFormattedText(remainingText)}
      </div>
    );
  }

  return <div className="space-y-2 text-xs leading-relaxed">{parts}</div>;
};

// Formats paragraphs, headers, bold, inline code, and lists
function renderFormattedText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ul') {
        renderedElements.push(
          <ul key={`list-${renderedElements.length}`} className="space-y-1 my-1.5 pl-1">
            {listItems}
          </ul>
        );
      } else {
        renderedElements.push(
          <ol key={`list-${renderedElements.length}`} className="space-y-1 my-1.5 pl-1 list-decimal list-inside">
            {listItems}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h4 key={`h4-${index}`} className="text-xs font-bold text-white mt-2.5 mb-1 flex items-center gap-1.5 text-[#A8F33A]">
          {formatInline(trimmed.substring(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h3 key={`h3-${index}`} className="text-sm font-bold text-white mt-3 mb-1 text-[#76B900]">
          {formatInline(trimmed.substring(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h2 key={`h2-${index}`} className="text-sm font-extrabold text-white mt-3 mb-1.5">
          {formatInline(trimmed.substring(2))}
        </h2>
      );
      return;
    }

    // Bullet List (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(
        <li key={`li-${index}`} className="flex items-start gap-1.5 text-neutral-300">
          <span className="text-[#76B900] mt-0.5 font-bold shrink-0">•</span>
          <span>{formatInline(trimmed.substring(2))}</span>
        </li>
      );
      return;
    }

    // Numbered List (1. 2. etc)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(
        <li key={`ol-${index}`} className="flex items-start gap-1.5 text-neutral-300">
          <span className="font-mono text-[11px] font-semibold text-[#76B900] shrink-0 mt-0.5">
            {numMatch[1]}.
          </span>
          <span>{formatInline(numMatch[2])}</span>
        </li>
      );
      return;
    }

    // Standard paragraph line
    flushList();
    renderedElements.push(
      <p key={`p-${index}`} className="text-neutral-200">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();
  return renderedElements;
}

// Formats **bold**, `inline code`, and *italics*
function formatInline(str: string): React.ReactNode {
  // Regex to match **bold** or `code`
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      parts.push(str.substring(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code 
          key={`c-${match.index}`} 
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#162014] text-[#A8F33A] font-mono text-[11px] border border-[#263721]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`i-${match.index}`} className="italic text-neutral-300">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < str.length) {
    parts.push(str.substring(lastIdx));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
