import React, { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

interface ProfileLinkProps {
  url: string;
}

export function ProfileLink({ url }: ProfileLinkProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the link stays visible to copy by hand.
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <LinkIcon size={16} className="text-blue-400" />
      <a href={url} className="terminal-text underline break-all">
        {url}
      </a>
      <button
        type="button"
        onClick={copy}
        className="px-2 py-1 rounded bg-[#24283b] border border-[#30365F] hover:border-[#7aa2f7]"
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <Check size={14} /> Copied
          </span>
        ) : (
          'Copy link'
        )}
      </button>
    </div>
  );
}
