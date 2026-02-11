const RE = /^https?:\/\/(www\.)?instagram\.com\/(reel|p|reels)\/[\w-]+/;
export function isInstagramUrl(url: string): boolean {
  return RE.test(url);
}
