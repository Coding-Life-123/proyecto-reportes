// Script de prueba para soiScraper.js
// Ejecutar con: node --experimental-vm-modules src/utils/scrapers/testSoi.js
// O simplemente: node src/utils/scrapers/testSoi.js (si el proyecto tiene "type": "module")

import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeSoi } from './soiScraper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const contractor = {
  docType:   'CC',
  docNumber: '1100971354',
  eps:       'SANITAS',
};

const month       = 1;    // ENERO
const year        = 2026;
const downloadDir = path.join(__dirname, '../../../../tmp/soi-test');

console.log('🚀 Iniciando prueba del scraper SOI...');
console.log('   Contratista:', contractor);
console.log('   Período:', `${month}/${year}`);
console.log('   Carpeta destino:', downloadDir);
console.log('');

try {
  const filePath = await scrapeSoi(contractor, month, year, downloadDir);
  console.log('✅ PDF descargado exitosamente en:', filePath);
} catch (err) {
  console.error('❌ Error durante el scraping:', err.message);
  process.exit(1);
}
