import React from 'react';
import { Download, Linkedin } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareButtonsProps {
  targetRef: React.RefObject<HTMLDivElement>;
  username: string;
}

export function ShareButtons({ targetRef, username }: ShareButtonsProps) {
  const downloadImage = async () => {
    if (targetRef.current) {
      const dataUrl = await toPng(targetRef.current);
      const link = document.createElement('a');
      link.download = `${username}-github-stats.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const shareToLinkedIn = () => {
    const text = `Check out my GitHub statistics generated by GitHub Terminal Stats!`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={downloadImage}
        className="flex items-center space-x-2 px-6 py-3 bg-[#24283b] text-[#7aa2f7] rounded-lg
                 hover:bg-[#2a2f44] transition-colors glow-effect"
      >
        <Download size={20} />
        <span>Download Stats</span>
      </button>
      
      <button
        onClick={shareToLinkedIn}
        className="flex items-center space-x-2 px-6 py-3 bg-[#24283b] text-[#7aa2f7] rounded-lg
                 hover:bg-[#2a2f44] transition-colors glow-effect"
      >
        <Linkedin size={20} />
        <span>Share on LinkedIn</span>
      </button>
    </div>
  );
}