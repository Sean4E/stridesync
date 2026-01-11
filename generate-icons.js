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
    const r = s * 0.21; // Corner radius
    const scale = s / 512; // Scale factor from base 512

    // Clear
    ctx.clearRect(0, 0, s, s);

    // Background gradient (indigo to purple)
    const grad = ctx.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#8b5cf6');

    // Rounded rect or full square for maskable
    ctx.beginPath();
    if (maskable) {
        ctx.rect(0, 0, s, s);
    } else {
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

    // Subtle shine overlay
    const shine = ctx.createLinearGradient(0, 0, s, s);
    shine.addColorStop(0, 'rgba(255,255,255,0.25)');
    shine.addColorStop(0.6, 'rgba(255,255,255,0)');
    shine.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = shine;
    ctx.fill();

    // Set up for drawing
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Offset for maskable icons (more padding)
    const offset = maskable ? s * 0.1 : 0;
    const innerScale = maskable ? 0.8 : 1;

    ctx.save();
    if (maskable) {
        ctx.translate(offset, offset);
        ctx.scale(innerScale, innerScale);
    }

    // Body stroke widths based on size
    const bodyWidth = Math.max(2, 28 * scale);
    const armWidth = Math.max(2, 24 * scale);
    const wispWidth1 = Math.max(1, 8 * scale);
    const wispWidth2 = Math.max(1, 6 * scale);
    const wispWidth3 = Math.max(1, 5 * scale);
    const wispWidth4 = Math.max(1, 4 * scale);

    // --- Artistic flowing wisps (trailing motion) ---
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = wispWidth1;
    ctx.beginPath();
    ctx.moveTo(80 * scale, 180 * scale);
    ctx.quadraticCurveTo(140 * scale, 170 * scale, 180 * scale, 190 * scale);
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.lineWidth = wispWidth2;
    ctx.beginPath();
    ctx.moveTo(60 * scale, 220 * scale);
    ctx.quadraticCurveTo(130 * scale, 200 * scale, 200 * scale, 230 * scale);
    ctx.stroke();

    ctx.globalAlpha = 0.35;
    ctx.lineWidth = wispWidth3;
    ctx.beginPath();
    ctx.moveTo(90 * scale, 260 * scale);
    ctx.quadraticCurveTo(150 * scale, 240 * scale, 190 * scale, 270 * scale);
    ctx.stroke();

    ctx.globalAlpha = 0.2;
    ctx.lineWidth = wispWidth4;
    ctx.beginPath();
    ctx.moveTo(70 * scale, 300 * scale);
    ctx.quadraticCurveTo(120 * scale, 280 * scale, 160 * scale, 310 * scale);
    ctx.stroke();

    // --- Abstract speed particles ---
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(100 * scale, 200 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(120 * scale, 240 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(90 * scale, 280 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // --- Dynamic runner silhouette - FLIPPED to face RIGHT ---
    ctx.globalAlpha = 1;

    // Head
    ctx.beginPath();
    ctx.arc(232 * scale, 120 * scale, 36 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning forward right)
    ctx.lineWidth = bodyWidth;
    ctx.beginPath();
    ctx.moveTo(244 * scale, 156 * scale);
    ctx.lineTo(292 * scale, 280 * scale);
    ctx.stroke();

    // Front arm (pumping forward to right)
    ctx.lineWidth = armWidth;
    ctx.beginPath();
    ctx.moveTo(260 * scale, 190 * scale);
    ctx.lineTo(202 * scale, 160 * scale);
    ctx.lineTo(172 * scale, 200 * scale);
    ctx.stroke();

    // Back arm (trailing left)
    ctx.beginPath();
    ctx.moveTo(260 * scale, 190 * scale);
    ctx.lineTo(332 * scale, 230 * scale);
    ctx.stroke();

    // Front leg (extended right)
    ctx.lineWidth = bodyWidth;
    ctx.beginPath();
    ctx.moveTo(292 * scale, 280 * scale);
    ctx.lineTo(192 * scale, 320 * scale);
    ctx.lineTo(132 * scale, 280 * scale);
    ctx.stroke();

    // Back leg (bent, pushing off left)
    ctx.beginPath();
    ctx.moveTo(292 * scale, 280 * scale);
    ctx.lineTo(372 * scale, 340 * scale);
    ctx.lineTo(392 * scale, 420 * scale);
    ctx.stroke();

    ctx.restore();
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
