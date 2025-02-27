export async function loadFonts(text: string = "") {
  const fonts = await Promise.all([
    {
      name: "BM Plex Sans TC",
      data: await fetch(
        "https://cdn.jsdelivr.net/npm/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff/hinted/IBMPlexSansTC-Medium.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 400,
      style: "normal",
    },
    {
      name: "BM Plex Sans TC",
      data: await fetch(
        "https://cdn.jsdelivr.net/npm/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff/hinted/IBMPlexSansTC-Bold.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 700,
      style: "bold",
    },
    {
      name: "BM Plex Sans JP",
      data: await fetch(
        "https://fonts.cdnfonts.com/s/93173/IBMPlexSansJP-Medium.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 500,
      style: "normal",
    },
    {
      name: "Noto Sans TC",
      data: await fetch(
        "https://fonts.cdnfonts.com/s/93173/IBMPlexSansJP-Bold.woff",
      ).then((res) => res.arrayBuffer()),
      weight: 600,
      style: "bold",
    },
  ]);

  return fonts;
}
