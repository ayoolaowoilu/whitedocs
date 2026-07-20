// components/AdPopup.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AdPopupProps {
  delay?: number;
  zoneId?: string;
  // How many hours before ad shows again after close (0 = never)
  showAgainAfterHours?: number;
  fallbackImage?: string;
  fallbackLink?: string;
  fallbackTitle?: string;
  onClose?: () => void;
}

export default function AdPopup({
  delay = 4000,
  zoneId,
  showAgainAfterHours = 0, // 0 = never show again
  fallbackImage = "https://via.placeholder.com/320x180/3b82f6/ffffff?text=Special+Offer",
  fallbackLink = "https://example.com",
  fallbackTitle = "Special Offer",
  onClose,
}: AdPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // start hidden until checked
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const storageKey = "adPopupDismissed";
  const storageTimeKey = "adPopupDismissedAt";

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    const dismissedAt = localStorage.getItem(storageTimeKey);

    let shouldShow = true;

    if (dismissed === "true" && dismissedAt) {
      if (showAgainAfterHours === 0) {
        shouldShow = false;
      } else {
        const hoursSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
        shouldShow = hoursSince >= showAgainAfterHours;
      }
    }

    if (!shouldShow) {
      setIsDismissed(true);
      return;
    }

    setIsDismissed(false);

    const timer = setTimeout(() => {
      setIsVisible(true);

      if (zoneId && adContainerRef.current && !scriptLoaded.current) {
        const script = document.createElement("script");
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = `//propellerads.com/api/v1/publisher/zones/${zoneId}/native.js`;
        adContainerRef.current.appendChild(script);
        scriptLoaded.current = true;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, zoneId, showAgainAfterHours]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(storageKey, "true");
    localStorage.setItem(storageTimeKey, Date.now().toString());
    onClose?.();
  }, [onClose]);

  if (isDismissed) return null;

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        w-80 sm:w-96
        bg-white rounded-xl shadow-2xl
        border border-gray-200
        transform transition-all duration-500 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}
      `}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg leading-none hover:bg-gray-700 transition-colors shadow-lg cursor-pointer z-10"
        aria-label="Close ad"
      >
        ×
      </button>

      {/* Ad content */}
      <div className="p-3">
        {zoneId ? (
          <div
            ref={adContainerRef}
            className="min-h-[180px] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
          >
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        ) : (
          <a
            href={fallbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={fallbackImage}
                alt={fallbackTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mt-2">{fallbackTitle}</h3>
            <p className="text-xs text-gray-500 mt-1">Sponsored</p>
          </a>
        )}
      </div>
    </div>
  );
}