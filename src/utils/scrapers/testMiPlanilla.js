/**
 * Script de prueba para el scraper de MiPlanilla.
 *
 * Uso:
 *   TWOCAPTCHA_API_KEY=tu_clave node src/utils/scrapers/testMiPlanilla.js
 *
 * O con dotenv (si tienes .env configurado):
 *   node src/utils/scrapers/testMiPlanilla.js
 */

import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeMiPlanilla } from './miPlanillaScraper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const screenshotDir = path.join(__dirname, '..', '..', '..', 'downloads', 'miplanilla');

(async () => {
  console.log('Iniciando prueba MiPlanilla…');
  console.log('Screenshot dir:', screenshotDir);

  try {
    const filePath = await scrapeMiPlanilla({
      docType:        'CC',
      docNumber:      '37898093',
      numeroPlanilla: '50885037',
      valorPlanilla:  590900,
      month:          1,        // Enero
      year:           2026,
      fechaPago:      '02/13/2026',
      screenshotDir,
    });

    console.log('✅ Screenshot generado:', filePath);
  } catch (err) {
    console.error('❌ Error al hacer scraping:', err.message);
    process.exit(1);
  }
})();
