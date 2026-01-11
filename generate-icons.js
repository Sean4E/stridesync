const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const maskableSizes = [192, 512];
const iconsDir = path.join(__dirname, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

function drawIcon(ctx, size, maskable = false) {
    const s = size;
    const r = s * 0.1875;

    // Clear
    ctx.clearRect(0, 0, s, s);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#818cf8');

    // Rounded rect or full square for maskable
    ctx.beginPath();
    if (maskable) {
        ctx.rect(0, 0, s, s);
    } else {
        // Manual rounded rect for older canvas versions
        ctx.moveTo(r, 0);
        ctx.lineTo(s - r, 0);
        ctx.quadraticCurveTo(s, 0, s, r);
        ctx.lineTo(s, s - r);
        ctx.quadraticCurveTo(s, s, s - r, s);
        ctx.lineTo(r, s);
        ctx.quadraticCurveTo(0, s, 0, s - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Icon lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = s * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = s / 2;
    const padding = maskable ? s * 0.25 : s * 0.2;
    const top = padding;
    const bottom = s - padding;
    const spread = s * 0.19;

    // Top chevron
    ctx.beginPath();
    ctx.moveTo(cx - spread, top + spread * 0.6);
    ctx.lineTo(cx, top);
    ctx.lineTo(cx + spread, top + spread * 0.6);
    ctx.stroke();

    // Middle vertical line
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx, bottom);
    ctx.stroke();

    // Bottom chevron
    ctx.beginPath();
    ctx.moveTo(cx - spread, bottom - spread * 0.6);
    ctx.lineTo(cx, bottom);
    ctx.lineTo(cx + spread, bottom - spread * 0.6);
    ctx.stroke();
}

function generateIcon(size, filename, maskable = false) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    drawIcon(ctx, size, maskable);

    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`Generated: ${filename}`);
}

console.log('Generating StrideSync icons...\n');

// Generate regular icons
sizes.forEach(size => {
    generateIcon(size, `icon-${size}.png`);
});

// Generate apple-touch-icon (copy of 180)
generateIcon(180, 'apple-touch-icon.png');

// Generate maskable icons
maskableSizes.forEach(size => {
    generateIcon(size, `icon-maskable-${size}.png`, true);
});

console.log('\nAll icons generated successfully!');
