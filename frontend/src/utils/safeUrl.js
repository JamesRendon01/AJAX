export function safeUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
