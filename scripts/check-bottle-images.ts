/**
 * Script to check which bottles need images and suggest sources
 * Run with: npx tsx scripts/check-bottle-images.ts
 */

import { whiskeyCollection } from '../src/data/whiskey-data';
import { bottleImageMap } from '../src/utils/bottleImages';
import { extractBrandName } from '../src/utils/brand-utils';
import { groupByExpression } from '../src/utils/expression-utils';
import fs from 'fs';
import path from 'path';

interface ImageStatus {
  expressionName: string;
  hasImage: boolean;
  imageFile: string | null;
  imageExists: boolean;
  bottles: number;
  sizes: string[];
  suggestedSources: string[];
}

function getSuggestedSources(expressionName: string, distillery: string): string[] {
  const sources: string[] = [];
  
  // Official distillery websites
  if (distillery === 'Buffalo Trace') {
    sources.push('https://www.buffalotracedistillery.com/');
  } else if (distillery === 'Heaven Hill') {
    sources.push('https://heavenhilldistillery.com/');
  } else if (distillery === 'Ardbeg') {
    sources.push('https://www.ardbeg.com/');
  } else if (distillery === 'Laphroaig') {
    sources.push('https://www.laphroaig.com/');
  }
  
  // General sources
  sources.push(
    'https://www.totalwine.com/',
    'https://www.wine-searcher.com/',
    'https://www.whiskybase.com/',
    'https://www.distiller.com/',
    'https://www.thewhiskyexchange.com/'
  );
  
  return sources;
}

function checkBottleImages() {
  // Group by expression
  const expressions = groupByExpression(whiskeyCollection);
  const publicBottlesPath = path.join(process.cwd(), 'public', 'bottles');
  
  const statuses: ImageStatus[] = expressions.map(expression => {
    const hasImage = expression.expressionName in bottleImageMap;
    const imageFile = hasImage ? bottleImageMap[expression.expressionName] : null;
    const imagePath = imageFile ? path.join(publicBottlesPath, imageFile) : null;
    const imageExists = imagePath ? fs.existsSync(imagePath) : false;
    
    const representativeBottle = expression.representativeBottle;
    const suggestedSources = getSuggestedSources(
      expression.expressionName,
      representativeBottle.distillery
    );
    
    return {
      expressionName: expression.expressionName,
      hasImage,
      imageFile,
      imageExists,
      bottles: expression.totalQuantity,
      sizes: expression.sizes,
      suggestedSources,
    };
  });
  
  // Separate into categories
  const withImages = statuses.filter(s => s.hasImage && s.imageExists);
  const missingImages = statuses.filter(s => !s.hasImage || !s.imageExists);
  const needsUpdate = statuses.filter(s => s.hasImage && !s.imageExists);
  
  console.log('\n📊 Bottle Image Status Report\n');
  console.log(`✅ Images Found: ${withImages.length}`);
  console.log(`❌ Missing Images: ${missingImages.length}`);
  console.log(`⚠️  Needs Update: ${needsUpdate.length}\n`);
  
  if (needsUpdate.length > 0) {
    console.log('⚠️  Images in mapping but file missing:');
    needsUpdate.forEach(s => {
      console.log(`   - ${s.expressionName} (expected: ${s.imageFile})`);
    });
    console.log('');
  }
  
  if (missingImages.length > 0) {
    console.log('❌ Missing Images:');
    missingImages.forEach(s => {
      console.log(`\n   ${s.expressionName}`);
      console.log(`   - Bottles: ${s.bottles}`);
      console.log(`   - Sizes: ${s.sizes.join(', ')}`);
      console.log(`   - Suggested sources:`);
      s.suggestedSources.slice(0, 3).forEach(source => {
        console.log(`     • ${source}`);
      });
    });
  }
  
  // Generate search terms
  console.log('\n\n🔍 Suggested Search Terms:\n');
  missingImages.forEach(s => {
    const searchTerms = [
      `${s.expressionName} bottle`,
      `${s.expressionName} whiskey`,
      `${s.expressionName} official image`,
    ];
    console.log(`${s.expressionName}:`);
    searchTerms.forEach(term => console.log(`   "${term}"`));
  });
  
  return { withImages, missingImages, needsUpdate };
}

// Run if executed directly
if (require.main === module) {
  checkBottleImages();
}

export { checkBottleImages };

