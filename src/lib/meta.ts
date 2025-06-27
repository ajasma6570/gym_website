const siteName = "Anatomy Family Fitness Centre";
const siteUrl = process.env.SITE_URL || "https://www.anatomy.in/";

export const icons = {
  icon: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/favicon-96x96.png",

    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  apple: [
    { rel: "apple-touch-icon", sizes: "57x57", url: "/apple-icon-57x57.png" },
    { rel: "apple-touch-icon", sizes: "60x60", url: "/apple-icon-60x60.png" },
    { rel: "apple-touch-icon", sizes: "72x72", url: "/apple-icon-72x72.png" },
    { rel: "apple-touch-icon", sizes: "76x76", url: "/apple-icon-76x76.png" },
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      url: "/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      url: "/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      url: "/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      url: "/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-icon-180x180.png",
    },
  ],
}



export const getOpenGraphData = () => ({
  title: siteName,
  description:
    "Looking for a gym in Kochi? Visit Anatomy Family Fitness Centre in Nayarambalam, Vypin. We offer expert trainers, CrossFit, strength training, and more.",
  images: [
    {
      url: `${siteUrl}/images/opengraph/2800x1600.webp`,
      width: 2800,
      height: 1600,
      alt: siteName,
    }
  ],
});
