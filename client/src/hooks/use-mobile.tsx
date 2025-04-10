import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is mobile
 * Returns true if viewport width is less than 768px
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < 768);

    // Event handler for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
