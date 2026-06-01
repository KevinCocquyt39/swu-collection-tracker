// Generates all Android mipmap icon sizes from icon.svg using sharp
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svgPath = path.join(__dirname, "icon.svg");
const androidResDir = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "res",
);

const sizes = [
  { dir: "mipmap-mdpi", size: 48 },
  { dir: "mipmap-hdpi", size: 72 },
  { dir: "mipmap-xhdpi", size: 96 },
  { dir: "mipmap-xxhdpi", size: 144 },
  { dir: "mipmap-xxxhdpi", size: 192 },
];

// Also output a 1024px version as resources/icon.png
const outDir = __dirname;

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Save 1024x1024 master PNG
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outDir, "icon.png"));
  console.log("✓ resources/icon.png (1024x1024)");

  for (const { dir, size } of sizes) {
    const destDir = path.join(androidResDir, dir);
    fs.mkdirSync(destDir, { recursive: true });

    // ic_launcher.png
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(destDir, "ic_launcher.png"));

    // ic_launcher_round.png (identical for now)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(destDir, "ic_launcher_round.png"));

    // ic_launcher_foreground.png (108dp density scale — 2.25× the base mipmap size)
    const fgSize = Math.round((size * 108) / 48);
    await sharp(svgBuffer)
      .resize(fgSize, fgSize)
      .png()
      .toFile(path.join(destDir, "ic_launcher_foreground.png"));

    console.log(`✓ ${dir} (${size}px)`);
  }

  // Write mipmap-anydpi-v26 adaptive icon XMLs
  const anydpiDir = path.join(androidResDir, "mipmap-anydpi-v26");
  fs.mkdirSync(anydpiDir, { recursive: true });

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
  fs.writeFileSync(path.join(anydpiDir, "ic_launcher.xml"), adaptiveXml);
  fs.writeFileSync(path.join(anydpiDir, "ic_launcher_round.xml"), adaptiveXml);
  console.log("✓ mipmap-anydpi-v26 adaptive icon XMLs");

  // Write background color
  const valuesDir = path.join(androidResDir, "values");
  const colorsPath = path.join(valuesDir, "ic_launcher_background.xml");
  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#03050F</color>
</resources>
`;
  // Only write if ic_launcher_background isn't already defined elsewhere
  const existingColors = path.join(valuesDir, "colors.xml");
  if (fs.existsSync(existingColors)) {
    const existing = fs.readFileSync(existingColors, "utf8");
    if (!existing.includes("ic_launcher_background")) {
      fs.writeFileSync(
        existingColors,
        existing.replace(
          "</resources>",
          '    <color name="ic_launcher_background">#03050F</color>\n</resources>',
        ),
      );
      console.log("✓ Appended ic_launcher_background to colors.xml");
    }
  } else {
    fs.writeFileSync(colorsPath, colorsXml);
    console.log("✓ ic_launcher_background.xml");
  }

  console.log("\n✅ All icons generated!");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
