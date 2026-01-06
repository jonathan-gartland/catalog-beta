// Utility functions for handling bottle images

export interface BottleImageMapping {
  [key: string]: string;
}

// Map whiskey names to actual image filenames in public/bottles/
export const bottleImageMap: BottleImageMapping = {
  // Ardbeg
  "Ardbeg Traigh Bhan": "traigh_bhan.jpg",
  "Ardbeg Wee Beastie": "weebeastie.jpg",

  // Laphroaig
  "Laphroaig 10 Cask Strength": "laphroaig.png",
  "Laphroaig Cardeas 2022": "laphroaig.png",
  "Laphroaig Cardeas 2023": "laphroaig.png",
  "Laphroaig Cardeas 2024 10yo": "laphroaig.png",
  "Laphroaig 10 Sherry Oak": "laphroaig.png",
  
  // Heaven Hill
  "Elijah Craig Barrel Proof": "ec_barrel-proof.png",
  "Elijah Craig Single Barrel 18yr": "ec-18-mob.png",
  "Larceny Barrel Proof": "larceny-barrel-proof.png",
  "Mellow Corn": "mellow-corn-mob.png",
  "Old Fitzgerald": "old-fitz-7-spring-18.png",
  "Heaven Hill 90th Anniversary": "hh90.jpg",
  
  // Buffalo Trace
  "Eagle Rare": "Eagle_Rare_LoRes.png",
  "Weller 12yr": "WLWeller_12YO.png",
  "Weller 12yr ": "WLWeller_12YO.png", // Note: data has trailing space
  "Weller Special Reserve": "weller-special-reserve.png",
  "Blanton's": "blantons.png",
  "Blanton's Gold": "blantons-gold.png",
  "Blanton's Black": "Blantons-SIngle-Barrel-black.png",
  "Blanton's Red": "Blantons-Takara-Red-1-Copy.jpg",
  "Blanton's SFTB": "blantons-sftb.png",

  // Beam
  "Old Grand Dad 7 yr": "ogd.jpg",
  
  // Other
  "Johnnie Walker White Walker": "white-walker-johnnie.png",
  "Heaven Hill 17 2022": "hb-parkar-bottle-desk.png",
};

// Brand-specific images for the main brand cards
export const brandImageMap: { [key: string]: string } = {
  "Laphroaig": "laphroaig10.jpg",
};

// Get the image path for a whiskey bottle
export function getBottleImage(whiskeyName: string): string {
  const imageName = bottleImageMap[whiskeyName];
  if (imageName) {
    return `/bottles/${imageName}`;
  }

  // Fallback to placeholder
  return "/bottles/placeholder-bottle.jpg";
}

// Get the image path for a brand (used in brand cards)
export function getBrandImage(brandName: string, fallbackBottleName: string): string {
  const brandImage = brandImageMap[brandName];
  if (brandImage) {
    return `/bottles/${brandImage}`;
  }

  // Fallback to bottle image
  return getBottleImage(fallbackBottleName);
}

// Check if a bottle image exists
export function hasBottleImage(whiskeyName: string): boolean {
  return whiskeyName in bottleImageMap;
}

// Get list of missing images
export function getMissingImages(): string[] {
  return Object.keys(bottleImageMap).filter(name => !hasBottleImage(name));
}