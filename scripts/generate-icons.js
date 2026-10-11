import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Master SVG
const masterSvgPath = path.join(PUBLIC_DIR, 'logo.svg');
const masterSvgContent = fs.readFileSync(masterSvgPath, 'utf8');

// Foreground SVG
const fgSvgPath = path.join(PUBLIC_DIR, 'ic_launcher_foreground.svg');
const fgSvgContent = fs.readFileSync(fgSvgPath, 'utf8');

// Background SVG
const bgSvgPath = path.join(PUBLIC_DIR, 'ic_launcher_background.svg');
const bgSvgContent = fs.readFileSync(bgSvgPath, 'utf8');

function renderSvgToPng(svgString, width, outputPath) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: width },
    shapeRendering: 2,
    textRendering: 1,
    imageRendering: 0,
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Rendered: ${outputPath} (${width}x${width})`);
}

// 1. Android standard square icons
const mipmaps = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

mipmaps.forEach(({ dir, size }) => {
  renderSvgToPng(masterSvgContent, size, path.join(PUBLIC_DIR, 'android', dir, 'ic_launcher.png'));
});

// 2. Android Round icons (circle clip)
const roundSvgContent = masterSvgContent.replace(
  '<defs>',
  `<defs><clipPath id="circleClip"><circle cx="256" cy="256" r="256" /></clipPath>`
).replace(
  '<rect width="512" height="512" rx="112"',
  '<g clip-path="url(#circleClip)"><rect width="512" height="512"'
).replace(
  '</svg>',
  '</g></svg>'
);

mipmaps.forEach(({ dir, size }) => {
  renderSvgToPng(roundSvgContent, size, path.join(PUBLIC_DIR, 'android', dir, 'ic_launcher_round.png'));
});

// 3. Play Store 512x512
renderSvgToPng(masterSvgContent, 512, path.join(PUBLIC_DIR, 'android', 'playstore-icon.png'));

// 4. Adaptive Foreground & Background PNGs (432x432)
renderSvgToPng(fgSvgContent, 432, path.join(PUBLIC_DIR, 'android', 'ic_launcher_foreground.png'));
renderSvgToPng(bgSvgContent, 432, path.join(PUBLIC_DIR, 'android', 'ic_launcher_background.png'));

// 5. Web & PWA assets
renderSvgToPng(masterSvgContent, 64, path.join(PUBLIC_DIR, 'favicon.png'));
renderSvgToPng(masterSvgContent, 48, path.join(PUBLIC_DIR, 'favicon.ico'));
renderSvgToPng(masterSvgContent, 180, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
renderSvgToPng(masterSvgContent, 192, path.join(PUBLIC_DIR, 'icon-192.png'));
renderSvgToPng(masterSvgContent, 512, path.join(PUBLIC_DIR, 'icon-512.png'));

// 6. Generate Android Adaptive Icon XML specifications
const icLauncherXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

const icLauncherRoundXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

const colorXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0F172A</color>
</resources>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'android', 'ic_launcher.xml'), icLauncherXml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'android', 'ic_launcher_round.xml'), icLauncherRoundXml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'android', 'values', 'ic_launcher_background.xml'), colorXml);

// Also copy foreground & background SVGs into android directory for convenience
fs.copyFileSync(path.join(PUBLIC_DIR, 'ic_launcher_foreground.svg'), path.join(PUBLIC_DIR, 'android', 'ic_launcher_foreground.svg'));
fs.copyFileSync(path.join(PUBLIC_DIR, 'ic_launcher_background.svg'), path.join(PUBLIC_DIR, 'android', 'ic_launcher_background.svg'));
fs.copyFileSync(path.join(PUBLIC_DIR, 'logo.svg'), path.join(PUBLIC_DIR, 'android', 'logo.svg'));

console.log('Successfully generated all Android launcher icon sizes and asset files!');
