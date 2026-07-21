
"use client";

import { useEffect } from "react";

export default function AdScript() {
  useEffect(() => {
    

    const script = document.createElement("script");
    script.dataset.zone = "11361472";
    script.src = "https://n6wxm.com/vignette.min.js";
    document.documentElement.appendChild(script);
  }, []);

  return null;
}