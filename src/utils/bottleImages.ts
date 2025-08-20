// Utility functions for handling bottle images

export interface BottleImageMapping {
  [key: string]: string;
}

// Map whiskey names to actual image filenames in public/bottles/
export const bottleImageMap: BottleImageMapping = {
  // Ardbeg
  "Ardbeg Traigh Bhan": "ardbeg.png",
  "Ardbeg Wee Beastie": "ardbeg.png",
  
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
  
  // Buffalo Trace
  "Weller 12yr": "WLWeller_12YO.png",
  "Weller Special Reserve": "weller-special-reserve.png", 
  "Blanton's": "blantons.png",
  "Blanton's Gold": "blantons-gold.png",
  "Blanton's Black": "Blantons-SIngle-Barrel-black.png",
  "Blanton's Red": "Blantons-Takara-Red-1-Copy.jpg",
  "Blanton's SFTB": "blantons-sftb.png",
  
  // Other
  "Johnnie Walker White Walker": "white-walker-johnnie.png",
  "Heaven Hill 17 2022": "hb-parkar-bottle-desk.png",
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

// Check if a bottle image exists
export function hasBottleImage(whiskeyName: string): boolean {
  return whiskeyName in bottleImageMap;
}

// Get list of missing images
export function getMissingImages(): string[] {
  return Object.keys(bottleImageMap).filter(name => !hasBottleImage(name));
}