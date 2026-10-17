import { normalizeWhatsAppRecipient } from "@/lib/whatsapp";
export const assets = {
  heroDesktop: "/images/hero-desktop.webp",
  heroMobile: "/images/hero-mobile.webp",
  heroTablet: "/images/hero-tablet.webp",
  aerial: "/images/aerial.webp",
  home: "/images/home.webp",
  detail: "/images/detail.webp",
  roads: "/images/roads.webp",
  park: "/images/park.webp",
  jodhpur: "/images/jodhpur.webp",
  lifestyle: "/images/lifestyle.webp",
  land: "/images/land.webp",
  sunset: "/images/sunset.webp",
};
export const site = {
  name: "JRH ESTATES",
  url: "https://jrhestates.com",
  location: "Jodhpur, Rajasthan",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  whatsapp:
    normalizeWhatsAppRecipient(process.env.NEXT_PUBLIC_WHATSAPP || "") || "",
  maps: "https://www.google.com/maps/search/?api=1&query=Jodhpur%2C+Rajasthan",
  navigation: [
    ["Home", "home"],
    ["About", "about"],
    ["Projects", "projects"],
    ["Amenities", "amenities"],
    ["Location", "location"],
    ["Contact", "contact"],
  ],
  project: {
    id: "nh125",
    name: "Jodhpur–Jaisalmer Road",
    location: "NH-125 corridor · Jodhpur",
    status: "Project details to be confirmed",
  },
  plots: [
    {
      id: "compact",
      name: "A considered beginning",
      area: 100,
      dimensions: "20 × 45 ft",
      description:
        "Room for a personal sanctuary, thoughtfully shaped around you.",
    },
    {
      id: "family",
      name: "Room to grow",
      area: 150,
      dimensions: "30 × 45 ft",
      description:
        "Imagine open courtyards, family gatherings and a little more room for life.",
    },
    {
      id: "generous",
      name: "Space for your vision",
      area: 200,
      dimensions: "30 × 60 ft",
      description:
        "A generous canvas for a home that reflects your own way of living.",
    },
  ],
  gallery: [
    {
      src: "/images/aerial.webp",
      label: "The bigger picture",
      alt: "Concept aerial rendering of organised empty residential plots and internal roads",
    },
    {
      src: "/images/roads.webp",
      label: "A thoughtful arrival",
      alt: "Concept of landscaped internal roads in a sandstone plotted community",
    },
    {
      src: "/images/park.webp",
      label: "Room to breathe",
      alt: "Concept of a native landscape park within a residential community",
    },
    {
      src: assets.land,
      label: "A canvas of possibilities",
      alt: "Concept of empty rectangular residential plots with low sandstone boundary markers",
    },
  ],
};
export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello JRH Estates, I would like to enquire about residential plots in Jodhpur and arrange a site visit.")}`
  : "#contact";
