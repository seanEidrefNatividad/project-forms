'use client';
import { useState, useEffect } from 'react';

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true); // Assume online initially

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    // Event listeners for changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return isOnline;
}

export default useNetworkStatus;