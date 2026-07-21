// components/adPopup.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface AdPopupProps {
  delay?: number; // ms before showing
  showAgainAfterHours?: number; // hours before showing again
  adUrl?: string; // direct ad link
  zoneId?: string; // optional zone ID
}

const STORAGE_KEY = "adPopupLastShown";

export default function AdPopup({
  delay = 5000,
  showAgainAfterHours = 24,
  adUrl = "https://omg10.com/4/11361565",
  zoneId,
}: AdPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we should show the popup
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const hoursSinceLastShown = lastShown
      ? (now - parseInt(lastShown)) / (1000 * 60 * 60)
      : Infinity;

    if (hoursSinceLastShown >= showAgainAfterHours) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay, showAgainAfterHours]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  const handleAdClick = useCallback(() => {
    // Open ad in new tab
    window.open(adUrl, "_blank", "noopener,noreferrer");
    handleClose();
  }, [adUrl, handleClose]);

  // Don't render during SSR
  if (!isClient || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          aria-label="Close ad"
        >
          <X size={18} />
        </button>

        {/* Ad content - Option 1: Clickable banner/image */}
        <div
          onClick={handleAdClick}
          className="cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
            <h3 className="text-white text-2xl font-bold mb-2">
              Sponsored Content
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Click to view our partner's offer
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors">
              View Offer
            </button>
          </div>
          
          {/* Optional: Show the actual ad URL for transparency */}
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center truncate">
            {adUrl}
          </div>
        </div>

        {/* Option 2: Iframe (uncomment if the ad supports iframe embedding) */}
        {/* 
        <iframe
          src={adUrl}
          className="w-full h-[400px] border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Advertisement"
        />
        */}
      </div>
    </div>
  );
}