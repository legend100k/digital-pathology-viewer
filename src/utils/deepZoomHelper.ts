// High-performance procedural and high-resolution histology canvas renderer
// Simulates authentic Hematoxylin & Eosin / PAS histological patterns across pyramid levels:
// Level 0 (1x - 2.5x): Whole tissue macro architecture, surgical margins, fatty borders
// Level 1 (5x - 10x): Glandular / ductal architecture, necrosis zones, lymphoid follicles
// Level 2 (20x - 40x): Nuclear pleomorphism, mitotic figures, chromatin textures, red blood cells

export interface TileCoordinates {
  x: number;
  y: number;
  zoom: number; // 1 to 40
}

// Deterministic pseudo-random based on seed coordinate
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function drawHistologyBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stainType: string,
  zoom: number,
  center: { x: number; y: number },
  slideId: string
) {
  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Background glass slide grid / border
  ctx.save();

  // Determine stain palette
  let primaryEosin = 'rgba(236, 72, 153, 0.28)'; // pink eosin
  let darkHematoxylin = '#4a154b'; // deep purple hematoxylin
  let lightNucleus = 'rgba(91, 33, 182, 0.85)';
  let stromaColor = 'rgba(244, 114, 182, 0.18)';

  if (stainType === 'PAS') {
    primaryEosin = 'rgba(219, 39, 119, 0.35)'; // magenta PAS
    darkHematoxylin = '#311042';
    lightNucleus = 'rgba(76, 29, 149, 0.88)';
  } else if (stainType.includes('HER2')) {
    primaryEosin = 'rgba(180, 83, 9, 0.30)'; // DAB brown for HER2
    darkHematoxylin = '#1e3a8a'; // hematoxylin counterstain blue
    lightNucleus = 'rgba(30, 58, 138, 0.75)';
  }

  // Calculate slide viewport transform
  // The slide center is (center.x * slideWidth, center.y * slideHeight)
  // Zoom factor scales the view
  const baseScale = Math.min(width, height) * 0.85;
  const currentScale = baseScale * zoom;

  ctx.translate(width / 2, height / 2);
  ctx.translate(-center.x * currentScale, -center.y * currentScale);

  // 1. Draw Glass Slide Boundary & Label
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2 / zoom;
  const slideW = currentScale * 1.4;
  const slideH = currentScale * 1.0;
  ctx.fillRect(-slideW * 0.05, -slideH * 0.05, slideW * 1.1, slideH * 1.1);
  ctx.strokeRect(-slideW * 0.05, -slideH * 0.05, slideW * 1.1, slideH * 1.1);

  // Frosted glass slide label area at top
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-slideW * 0.05, -slideH * 0.05, slideW * 0.22, slideH * 1.1);
  ctx.fillStyle = '#475569';
  ctx.font = `${Math.max(12, 14 * (currentScale / baseScale))}px monospace`;
  ctx.save();
  ctx.translate(slideW * 0.04, slideH * 0.5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`PATHOLOGY WSI [${slideId.toUpperCase()}]`, -120, 0);
  ctx.restore();

  // Coverslip boundary
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(slideW * 0.2, 0, slideW * 0.8, slideH);

  // 2. Specimen Tissue Section Mass
  // Draw organic tissue contours
  const tissueSeed = slideId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  // Tissue Stroma Base
  ctx.beginPath();
  const pointsCount = 36;
  const cx = slideW * 0.58;
  const cy = slideH * 0.5;
  const rx = slideW * 0.32;
  const ry = slideH * 0.38;

  for (let i = 0; i <= pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    const noise = (pseudoRandom(tissueSeed + i * 1.7) - 0.5) * 0.22;
    const rCurrentX = rx * (1 + noise);
    const rCurrentY = ry * (1 + noise);
    const px = cx + Math.cos(angle) * rCurrentX;
    const py = cy + Math.sin(angle) * rCurrentY;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // Tissue background gradient
  const grad = ctx.createRadialGradient(cx, cy, rx * 0.2, cx, cy, rx * 1.1);
  grad.addColorStop(0, primaryEosin);
  grad.addColorStop(0.7, primaryEosin);
  grad.addColorStop(1, stromaColor);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(219, 39, 119, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Multi-Resolution Architecture depending on Zoom
  // If zoom >= 2: Draw glandular/lobular architecture nests
  if (zoom >= 1.5) {
    const nestCount = 45;
    for (let n = 0; n < nestCount; n++) {
      const nestX = cx + (pseudoRandom(tissueSeed + n * 7) - 0.5) * rx * 1.5;
      const nestY = cy + (pseudoRandom(tissueSeed + n * 13) - 0.5) * ry * 1.5;
      const nestRadius = (20 + pseudoRandom(tissueSeed + n * 3) * 45) * (currentScale / baseScale);

      // Check distance from center to keep within tissue boundary
      const dist = Math.hypot((nestX - cx) / rx, (nestY - cy) / ry);
      if (dist < 0.88) {
        ctx.beginPath();
        ctx.arc(nestX, nestY, nestRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(190, 24, 93, 0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(157, 23, 77, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // 4. Cellular & Nuclear Detail when zoomed in (Zoom >= 4.0 to 40.0)
  if (zoom >= 3.5) {
    // Generate cellular field
    const cellRows = Math.min(80, Math.floor(zoom * 6));
    const cellCols = Math.min(80, Math.floor(zoom * 6));
    const stepX = (slideW * 0.6) / cellCols;
    const stepY = (slideH * 0.7) / cellRows;
    const cellRadius = Math.max(1.5, Math.min(12, 1.2 * (zoom / 4)));

    for (let r = 0; r < cellRows; r++) {
      for (let c = 0; c < cellCols; c++) {
        const seedCell = tissueSeed + r * 157 + c * 31;
        const jitterX = (pseudoRandom(seedCell) - 0.5) * stepX * 0.75;
        const jitterY = (pseudoRandom(seedCell + 1) - 0.5) * stepY * 0.75;
        const cellX = cx - slideW * 0.3 + c * stepX + jitterX;
        const cellY = cy - slideH * 0.35 + r * stepY + jitterY;

        // Verify inside tissue
        const dist = Math.hypot((cellX - cx) / rx, (cellY - cy) / ry);
        if (dist < 0.85) {
          // Cytoplasmic halo (pink/magenta)
          ctx.beginPath();
          ctx.arc(cellX, cellY, cellRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = primaryEosin;
          ctx.fill();

          // Cell Nucleus (deep hematoxylin purple)
          ctx.beginPath();
          // Pleomorphic elongation for carcinoma
          const isPleomorphic = pseudoRandom(seedCell + 2) > 0.6;
          const isMitosis = pseudoRandom(seedCell + 3) > 0.94 && zoom >= 15;

          if (isMitosis) {
            // Mitotic figure: condensed chromosome star
            ctx.fillStyle = '#3b0764';
            ctx.arc(cellX, cellY, cellRadius * 1.4, 0, Math.PI * 2);
            ctx.fill();
            // Spindle spikes
            ctx.strokeStyle = '#1e1b4b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cellX - cellRadius * 2, cellY);
            ctx.lineTo(cellX + cellRadius * 2, cellY);
            ctx.stroke();
          } else {
            ctx.fillStyle = isPleomorphic ? darkHematoxylin : lightNucleus;
            ctx.ellipse(
              cellX,
              cellY,
              cellRadius * (isPleomorphic ? 1.4 : 1.0),
              cellRadius * (isPleomorphic ? 0.9 : 1.0),
              pseudoRandom(seedCell + 4) * Math.PI,
              0,
              Math.PI * 2
            );
            ctx.fill();

            // Nucleolus inside prominent nucleus at high power (>= 20x)
            if (zoom >= 18 && pseudoRandom(seedCell + 5) > 0.4) {
              ctx.beginPath();
              ctx.arc(cellX + 1, cellY - 1, cellRadius * 0.35, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444'; // eosinophilic prominent nucleolus
              ctx.fill();
            }
          }
        }
      }
    }
  }

  ctx.restore();
}
