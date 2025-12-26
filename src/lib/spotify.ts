export function getSpotifyEmbedUrl(trackUrl: string | null): string | null {
  if (!trackUrl) return null;
  try {
    const url = new URL(trackUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] !== "track" || !parts[1]) {
      return null;
    }
    return `https://open.spotify.com/embed/track/${parts[1]}`;
  } catch {
    return null;
  }
}
