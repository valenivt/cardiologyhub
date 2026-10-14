import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Allow large payloads for base64 photo storage
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const IMAGES_DIR = path.resolve(PUBLIC_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Serve public directory statically
app.use(express.static(PUBLIC_DIR));

// Endpoint to get all available team photos from server disk
app.get('/api/team-photos', (_req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    const photos: Record<string, string> = {};

    files.forEach((file) => {
      const lower = file.toLowerCase();
      let matchedId: string | null = null;
      if (lower.includes('valen') || lower.includes('whatsapp')) {
        matchedId = 'valensya';
      } else if (lower.includes('barbie')) {
        matchedId = 'barbie';
      } else if (lower.includes('brilliana') || lower.includes('wennardo')) {
        matchedId = 'brilliana';
      } else if (lower.includes('brendon')) {
        matchedId = 'brendon';
      } else if (lower.includes('nath')) {
        matchedId = 'nath';
      } else if (lower.includes('cayley') || lower.includes('mclin')) {
        matchedId = 'cayley';
      }

      if (matchedId && !photos[matchedId]) {
        photos[matchedId] = `/images/${encodeURIComponent(file)}`;
      }
    });

    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Endpoint to upload and persist photos directly to the server backend disk
app.post('/api/upload-team-photo', (req, res) => {
  try {
    const { memberId, fileName, dataUrl } = req.body;
    if (!memberId || !dataUrl) {
      return res.status(400).json({ success: false, error: 'Missing memberId or dataUrl' });
    }

    const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid data URL format' });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const safeFileName = `${memberId}.jpeg`;
    const targetPath = path.join(IMAGES_DIR, safeFileName);
    fs.writeFileSync(targetPath, buffer);

    // Also write alias with original filename if provided
    if (fileName) {
      try {
        const originalPath = path.join(IMAGES_DIR, fileName);
        fs.writeFileSync(originalPath, buffer);
      } catch (e) {
        // ignore
      }
    }

    const publicUrl = `/images/${safeFileName}`;
    res.json({ success: true, memberId, url: publicUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const DIST_DIR = path.resolve(__dirname, 'dist');
    app.use(express.static(DIST_DIR));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(DIST_DIR, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cardiology Hub backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
