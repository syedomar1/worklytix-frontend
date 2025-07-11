import { useState, useEffect } from "react";

// Custom hook to detect if it's mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // You can adjust the width threshold here
    };

    handleResize(); // Initial check on load
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  return isMobile;
};
