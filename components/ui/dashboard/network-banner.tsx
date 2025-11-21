'use client';
import useNetworkStatus from '@/hooks/useNetworkStatus';

export default function NetworkBanner() {
  const { online, reachable, type } = useNetworkStatus(150); // 150ms debounce

  if (online && reachable) return null;

  return (
    <div style={{position:'fixed', bottom:0, left:0, right:0, padding:'8px 12px',
                 background: '#111827', color:'#fff', fontSize:14}}>
      { !online
        ? 'You’re offline. Changes will sync when you reconnect.'
        : 'Network is unstable. Working from cache; we’ll sync when reachable.' }
      { type ? <span style={{opacity:.7, marginLeft:8}}>(network: {type})</span> : null }
    </div>
  );
}
