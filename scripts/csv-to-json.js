import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'public', 'artwork.csv');
const jsonPath = path.join(process.cwd(), 'public', 'art_manifest.json');

const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.split('\n').map(line => line.trim()).filter(line => line && line.startsWith('http'));
const images = lines.map(url => ({ image: url, title: "" }));

fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2));
console.log('Converted artwork.csv to art_manifest.json');
