#!/usr/bin/env node
/**
 * 掃描資料夾內所有 PNG/JPG/WebP，轉成「內嵌圖片的 SVG」
 *
 * 用法：
 *   node scripts/embed-images-to-svg.mjs                    # 掃描 public/shop 和 public/coach
 *   node scripts/embed-images-to-svg.mjs public/shop         # 只掃描指定資料夾
 *   node scripts/embed-images-to-svg.mjs public --recursive # 遞迴掃描 public 下所有子資料夾
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

const IMG_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function getAllImageFiles(dir, recursive = false) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory() && recursive) {
      results.push(...getAllImageFiles(fullPath, true));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (IMG_EXTENSIONS.includes(ext)) {
        results.push({ fullPath, baseName: path.basename(ent.name, ext), ext });
      }
    }
  }
  return results;
}

function getMimeType(ext) {
  const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
  return mime[ext.toLowerCase()] ?? 'image/png';
}

function createSvgWrapper(imagePath, ext) {
  const buf = fs.readFileSync(imagePath);
  const b64 = buf.toString('base64');
  const mime = getMimeType(ext);
  const dataUri = `data:${mime};base64,${b64}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" width="64" height="64">
  <image href="${dataUri}" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

// 解析參數
const args = process.argv.slice(2);
const targetArg = args[0];
const recursive = args.includes('--recursive');

let dirsToScan = [];
if (targetArg) {
  const targetPath = path.isAbsolute(targetArg) ? targetArg : path.join(root, targetArg);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    dirsToScan = [targetPath];
  }
} else {
  dirsToScan = [
    path.join(publicDir, 'shop'),
    path.join(publicDir, 'coach'),
  ].filter((d) => fs.existsSync(d));
  if (dirsToScan.length === 0) {
    dirsToScan = [publicDir];
    console.log('No shop/coach folders found, scanning public/');
  }
}

let count = 0;
for (const dir of dirsToScan) {
  const images = getAllImageFiles(dir, recursive || dir === publicDir);
  for (const { fullPath, baseName, ext } of images) {
    const svgPath = path.join(path.dirname(fullPath), baseName + '.svg');
    const svg = createSvgWrapper(fullPath, ext);
    fs.writeFileSync(svgPath, svg);
    console.log('Created:', path.relative(root, svgPath));
    count++;
  }
}

console.log(`Done. Created ${count} SVG(s).`);
