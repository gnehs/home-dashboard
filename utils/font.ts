class FontCache {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }
}

const fontCache = new FontCache();

export async function loadFonts(text: string = "") {
  const cacheKey = "fonts";
  const cachedFonts = fontCache.get<ArrayBuffer[]>(cacheKey);
  if (cachedFonts) {
    return cachedFonts;
  }

  const fonts = await Promise.all([
    {
      name: "IBM Plex Sans TC",
      data: await fetch(
        "https://cdn.jsdelivr.net/npm/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff/hinted/IBMPlexSansTC-Medium.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Sans TC",
      data: await fetch(
        "https://cdn.jsdelivr.net/npm/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff/hinted/IBMPlexSansTC-Bold.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 700,
      style: "bold",
    },
    {
      name: "IBM Plex Sans JP",
      data: await fetch(
        "https://fonts.cdnfonts.com/s/93173/IBMPlexSansJP-Medium.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 500,
      style: "normal",
    },
    {
      name: "IBM Plex Sans JP",
      data: await fetch(
        "https://fonts.cdnfonts.com/s/93173/IBMPlexSansJP-Bold.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 700,
      style: "bold",
    },
  ]);

  fontCache.set(cacheKey, fonts);
  return fonts;
}
