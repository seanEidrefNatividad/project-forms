'use client';
import { useEffect, useRef, useState } from 'react';

type NetState = {
  online: boolean;          // from navigator.onLine
  reachable: boolean;       // result of last ping
  type?: string;            // e.g., '4g', '3g' (if available)
};

// const PING_URL = '/ping.txt'; // put a 1–byte file in /public
// const PING_OPTS: RequestInit = {
//   method: 'GET',
//   cache: 'no-store',
//   credentials: 'omit',
// };

async function checkReachable(signal?: AbortSignal): Promise<boolean> {
  try {
    //const res = await fetch(`${PING_URL}?t=${Date.now()}`, { ...PING_OPTS, signal });
    //return res.ok;
    return true;
  } catch {
    return false;
  }
}

export default function useNetworkStatus(pingDelay = 0) {
  const [state, setState] = useState<NetState>(() => ({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    reachable: true,
    type: typeof navigator !== 'undefined' && 'connection' in navigator
      ? (navigator as any).connection?.effectiveType
      : undefined,
  }));

  const abortRef = useRef<AbortController | null>(null);

  const runPing = async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    // optional delay to coalesce multiple events
    if (pingDelay) await new Promise(r => setTimeout(r, pingDelay));
    const reachable = await checkReachable(abortRef.current.signal);
    setState(s => ({ ...s, reachable }));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnline = () => {
      setState(s => ({
        ...s,
        online: navigator.onLine,
        type: (navigator as any).connection?.effectiveType,
      }));
      // whenever online toggles, verify actual reachability
      void runPing();
    };

    // initial verify (on mount)
    void runPing();

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    // optional: react to connection quality changes
    const conn = (navigator as any).connection;
    const onConnChange = () => setState(s => ({ ...s, type: conn?.effectiveType }));
    conn?.addEventListener?.('change', onConnChange);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
      conn?.removeEventListener?.('change', onConnChange);
      abortRef.current?.abort();
    };
  }, [pingDelay]);

  return state; // { online, reachable, type }
}
