/**
 * ProHair API URL yordamchisi.
 * Agar foydalanuvchi lokal muhitda Vite dev serverida (masalan port 8080) bo'lsa,
 * so'rovlarni avtomatik ravishda Express backend serveri (port 5000) ga yo'naltiradi.
 * Production (prohair.golders.uz) yoki port 5000 ning o'zida esa nisbiy URL (/api/...) ishlatiladi.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '5000') {
      return `http://${hostname}:5000`;
    }
  }
  return '';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
