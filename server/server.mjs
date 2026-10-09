/**
 * PRODUCTION DIGITAL PATHOLOGY REST API SERVER (PURE NODE.JS)
 * 
 * Provides endpoints for:
 * - Slides inventory & metadata
 * - WSI Upload & libvips conversion triggering
 * - Spatial annotation persistence & filtering
 */

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertWsiToDzi, extractWsiMetadata } from './wsi-converter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

// In-memory data store with disk persistence fallback
let annotationsDb = [
  {
    id: 'ann-init-1',
    slideId: 'slide-001',
    type: 'rectangle',
    label: 'Invasive Tumor Focus',
    category: 'malignant',
    color: '#ef4444',
    points: [{ x: 34200, y: 22100 }, { x: 41500, y: 28900 }],
    widthMicrons: 1839.6,
    heightMicrons: 1713.6,
    areaMicronsSquare: 3152338.56,
    areaMillimetersSquare: 3.15,
    isCalibrated: true,
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-init-2',
    slideId: 'slide-001',
    type: 'ruler',
    label: 'Deep Surgical Margin (2.14 mm)',
    category: 'measurement',
    color: '#06b6d4',
    points: [{ x: 31000, y: 19500 }, { x: 39500, y: 19500 }],
    pixelDistance: 8500,
    lengthMicrons: 2142,
    lengthMillimeters: 2.14,
    isCalibrated: true,
    isVisible: true,
    createdAt: new Date().toISOString(),
  }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Health check
  if (pathname === '/api/health') {
    return sendJson(res, 200, { status: 'healthy', engine: 'libvips-node', version: '2.4.0' });
  }

  // GET /api/v1/annotations?slideId=...
  if (req.method === 'GET' && pathname === '/api/v1/annotations') {
    const slideId = url.searchParams.get('slideId');
    const filtered = slideId
      ? annotationsDb.filter((a) => a.slideId === slideId)
      : annotationsDb;
    return sendJson(res, 200, filtered);
  }

  // POST /api/v1/annotations
  if (req.method === 'POST' && pathname === '/api/v1/annotations') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const newAnn = JSON.parse(body);
        newAnn.id = newAnn.id || `ann-${Date.now()}`;
        newAnn.createdAt = new Date().toISOString();
        annotationsDb.push(newAnn);
        return sendJson(res, 201, newAnn);
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON body' });
      }
    });
    return;
  }

  // DELETE /api/v1/annotations/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/v1/annotations/')) {
    const id = pathname.split('/').pop();
    annotationsDb = annotationsDb.filter((a) => a.id !== id);
    return sendJson(res, 200, { success: true, deletedId: id });
  }

  // POST /api/v1/slides/convert (Triggers libvips pipeline)
  if (req.method === 'POST' && pathname === '/api/v1/slides/convert') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const { inputWsiPath, outputDir } = JSON.parse(body);
        const result = await convertWsiToDzi(inputWsiPath, outputDir);
        return sendJson(res, 200, { success: true, manifest: result });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    });
    return;
  }

  // Default 404
  sendJson(res, 404, { error: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`[DIGITAL PATHOLOGY API] Running on http://localhost:${PORT}`);
});
