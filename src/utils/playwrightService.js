import { chromium } from 'playwright';
import fs from 'fs';

/**
 * Ejecuta una función de scraping dentro de un contexto de navegador Playwright.
 * Crea el navegador, el contexto y la página, los pasa al scraperFn y los cierra al final.
 *
 * @param {Function} scraperFn - Función async que recibe (page, context) y contiene la lógica del scraping.
 * @param {Object}   options
 * @param {string}   [options.downloadDir] - Carpeta local donde se guardarán los archivos descargados.
 * @param {boolean}  [options.headless=true] - Si el navegador corre sin interfaz gráfica.
 *
 * @returns {Promise<*>} - Lo que retorne scraperFn.
 */
export const runScraper = async (scraperFn, options = {}) => {
  const { downloadDir, headless = true } = options;

  // Si se especifica carpeta de descargas, crearla si no existe
  if (downloadDir && !fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless,
    args: [
      '--disable-pdf-extension',      // Evita que Chrome abra PDFs inline
      '--disable-plugins-discovery',  // Desactiva plugins automáticos
    ]
  });

  const contextOptions = {
    acceptDownloads: true,
  };

  const context = await browser.newContext(contextOptions);
  const page    = await context.newPage();

  try {
    const result = await scraperFn(page, context);
    return result;
  } finally {
    await browser.close();
  }
};
