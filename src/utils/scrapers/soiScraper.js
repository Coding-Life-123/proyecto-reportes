import { runScraper } from '../playwrightService.js';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

// ─── Mapas de conversión ────────────────────────────────────────────────────

const DOC_TYPE_MAP = {
  'CC':  '1',
  'TI':  '3',
  'CE':  '6',
  'NIT': '14',
  'PA':  '5',
  'CD':  '8',
  'SC':  '7',
  'PEP': '9',
  'PPT': '10',
};

const EPS_MAP = {
  'ALIANSALUD':    '125',
  'SALUD TOTAL':   '126',
  'SANITAS':       '128',
  'COMPENSAR':     '130',
  'FAMISANAR':     '138',
  'NUEVA EPS':     '171',
  'SURA':          '132',
  'EMSSANAR':      '282',
  'CAPITAL SALUD': '303',
  'ADRES':         '215',
  'NO APORTA':     '0',
};

const resolveEps = (epsName) => {
  if (!epsName) return '0';
  const key = Object.keys(EPS_MAP).find(k =>
    epsName.toUpperCase().includes(k.toUpperCase())
  );
  if (!key) throw new Error(`EPS no reconocida: "${epsName}". Agrégala al EPS_MAP.`);
  return EPS_MAP[key];
};

// ─── Scraper principal ───────────────────────────────────────────────────────

/**
 * Descarga el certificado de aportes de un contratista desde el portal SOI.
 * SOI retorna un ZIP que contiene el PDF. Lo descomprimimos y guardamos el PDF.
 */
export const scrapeSoi = async (contractor, month, year, downloadDir) => {
  const docTypeValue = DOC_TYPE_MAP[contractor.docType.toUpperCase()];
  if (!docTypeValue) throw new Error(`Tipo de documento no reconocido: "${contractor.docType}"`);

  const epsValue   = resolveEps(contractor.eps);
  const monthValue = String(month);
  const yearValue  = String(year);

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  return runScraper(async (page) => {
    // 1. Navegar primero con domcontentloaded para no bloquear en networkidle
    await page.goto('https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Esperar que los selects estén listos
    await page.waitForSelector('#tipoDocumentoAportante', { timeout: 15000 });

    // 2. Registrar el interceptor DESPUÉS de cargar la página
    //    para capturar el ZIP del POST sin interferir con el GET inicial
    let zipBuffer = null;

    await page.route('**/*certificadoAportesCotizante*', async (route, request) => {
      if (request.method() === 'POST') {
        const response = await route.fetch();
        const contentType = response.headers()['content-type'] || '';
        const disposition = response.headers()['content-disposition'] || '';

        if (contentType.includes('octet-stream') || disposition.includes('.zip')) {
          zipBuffer = await response.body();
        }
        await route.fulfill({ response });
      } else {
        await route.continue();
      }
    });

    // 3. Llenar el formulario ─────────────────────────────────────────────────
    await page.selectOption('#tipoDocumentoAportante', docTypeValue);
    await page.fill('input[name="numeroDocumentoAportante"]', contractor.docNumber);

    await page.selectOption('#tipoDocumentoCotizante', docTypeValue);
    await page.fill('#numeroDocumentoCotizante', contractor.docNumber);

    await page.selectOption('#administradoraSalud', epsValue);
    await page.selectOption('#periodoLiqSaludMes', monthValue);
    await page.selectOption('#periodoLiqSaludAnnio', yearValue);

    // 4. Click y esperar a que el route capture el ZIP ─────────────────────────
    await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }).catch(() => null),
      page.click('button.btn-success'),
    ]);

    // Dar margen para que route.fetch() complete la lectura del body
    await page.waitForTimeout(2000);

    if (!zipBuffer || zipBuffer.length < 100) {
      const errorEl = await page.$('.alert-danger, [class*="error"]').catch(() => null);
      const errorMsg = errorEl
        ? (await errorEl.textContent()).trim()
        : 'No se encontró planilla para los datos ingresados';
      throw new Error(`SOI: ${errorMsg}`);
    }

    // 5. Extraer el PDF del ZIP ────────────────────────────────────────────────
    const zip = new AdmZip(zipBuffer);
    const pdfEntry = zip.getEntries().find(e => e.entryName.toLowerCase().endsWith('.pdf'));

    if (!pdfEntry) {
      throw new Error('El ZIP de SOI no contiene un archivo PDF.');
    }

    const fileName = `soi_${contractor.docNumber}_${year}_${String(month).padStart(2, '0')}.pdf`;
    const filePath = path.join(downloadDir, fileName);

    fs.writeFileSync(filePath, pdfEntry.getData());
    return filePath;

  }, { downloadDir });
};
