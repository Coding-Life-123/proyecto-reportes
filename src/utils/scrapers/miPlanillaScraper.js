import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// ─── Mapas de conversión ────────────────────────────────────────────────────

const DOC_TYPE_MAP = {
  'CC':  'CC',
  'CE':  'CE',
  'TI':  'TI',
  'NIT': 'NIT',
  'PA':  'PA',
};

const MONTH_MAP = {
  1:  'Enero',
  2:  'Febrero',
  3:  'Marzo',
  4:  'Abril',
  5:  'Mayo',
  6:  'Junio',
  7:  'Julio',
  8:  'Agosto',
  9:  'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre',
};

// ─── Resolución de reCAPTCHA con 2Captcha ───────────────────────────────────

const TWOCAPTCHA_API_KEY = process.env.TWOCAPTCHA_API_KEY;
const SITE_KEY           = '6Ldtl5EUAAAAAKd0iW_OofA72U_r8982L9vSgY0o';
const TARGET_URL         = 'https://empresas.miplanilla.com/Registro/ConsultaPagoAportes/ConsultaPagoAportes';

/**
 * Envía el reCAPTCHA a 2Captcha y espera el token de respuesta.
 * Requiere la variable de entorno TWOCAPTCHA_API_KEY.
 */
const solveRecaptcha = async () => {
  if (!TWOCAPTCHA_API_KEY) {
    throw new Error('Falta la variable de entorno TWOCAPTCHA_API_KEY para resolver el reCAPTCHA de MiPlanilla.');
  }

  // 1. Enviar la tarea a 2Captcha
  const submitRes = await fetch(
    `https://2captcha.com/in.php?key=${TWOCAPTCHA_API_KEY}&method=userrecaptcha` +
    `&googlekey=${SITE_KEY}&pageurl=${encodeURIComponent(TARGET_URL)}&json=1`
  );
  const submitData = await submitRes.json();

  if (submitData.status !== 1) {
    throw new Error(`2Captcha submit error: ${submitData.request}`);
  }

  const captchaId = submitData.request;

  // 2. Polling hasta obtener la solución (máx ~120 s)
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 5000));

    const pollRes = await fetch(
      `https://2captcha.com/res.php?key=${TWOCAPTCHA_API_KEY}&action=get&id=${captchaId}&json=1`
    );
    const pollData = await pollRes.json();

    if (pollData.status === 1) {
      return pollData.request; // token g-recaptcha-response
    }
    if (pollData.request !== 'CAPCHA_NOT_READY') {
      throw new Error(`2Captcha poll error: ${pollData.request}`);
    }
  }

  throw new Error('2Captcha: tiempo de espera agotado al resolver el reCAPTCHA.');
};

// ─── Scraper principal ───────────────────────────────────────────────────────

/**
 * Consulta el estado de pago de aportes en el portal MiPlanilla.
 * Completa el formulario, resuelve el reCAPTCHA (vía 2Captcha) y
 * guarda un screenshot de la tabla de resultados.
 *
 * @param {Object} params
 * @param {string} params.docType       - Tipo de documento del contratista (ej: 'CC')
 * @param {string} params.docNumber     - Número de documento (ej: '37898093')
 * @param {string} params.numeroPlanilla - Número de planilla (ej: '50885037')
 * @param {number} params.valorPlanilla  - Valor de la planilla (ej: 590900)
 * @param {number} params.month         - Mes de pago (1-12)
 * @param {number} params.year          - Año de pago (ej: 2026)
 * @param {string} params.fechaPago     - Fecha de pago en formato MM/DD/YYYY (ej: '02/13/2026')
 * @param {string} params.screenshotDir - Carpeta donde se guardará el screenshot
 *
 * @returns {Promise<string>} Ruta absoluta del screenshot generado
 */
export const scrapeMiPlanilla = async ({
  docType,
  docNumber,
  numeroPlanilla,
  valorPlanilla,
  month,
  year,
  fechaPago,
  screenshotDir,
}) => {
  // ── Validaciones básicas ─────────────────────────────────────────────────
  const docTypeValue = DOC_TYPE_MAP[docType?.toUpperCase()];
  if (!docTypeValue) {
    throw new Error(`Tipo de documento no reconocido: "${docType}". Usa: ${Object.keys(DOC_TYPE_MAP).join(', ')}`);
  }

  const monthLabel = MONTH_MAP[Number(month)];
  if (!monthLabel) {
    throw new Error(`Mes inválido: ${month}. Usa un número entre 1 y 12.`);
  }

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // ── Resolver reCAPTCHA antes de abrir el navegador ───────────────────────
  console.log('[MiPlanilla] Resolviendo reCAPTCHA con 2Captcha…');
  const captchaToken = await solveRecaptcha();
  console.log('[MiPlanilla] reCAPTCHA resuelto ✓');

  // ── Iniciar navegador ────────────────────────────────────────────────────
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();

  try {
    // 1. Navegar al formulario
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#tipoDocumento', { timeout: 15000 });

    // 2. Llenar el formulario ─────────────────────────────────────────────
    await page.selectOption('#tipoDocumento', docTypeValue);
    await page.fill('#numeroDocumento', String(docNumber));
    await page.fill('#numeroPlanilla',  String(numeroPlanilla));
    await page.fill('#valorPlanilla',   String(valorPlanilla));

    await page.selectOption('#periodoPagoMes',   monthLabel);
    await page.selectOption('#periodoPagoAnual', String(year));

    // Fecha de pago: limpiar y escribir en formato MM/DD/YYYY
    await page.click('#fechaPago');
    await page.fill('#fechaPago', fechaPago);
    // Dispara el evento change para que el datepicker valide el valor
    await page.dispatchEvent('#fechaPago', 'change');

    // 3. Inyectar el token de reCAPTCHA en el campo oculto ────────────────
    await page.evaluate((token) => {
      // Establece el campo oculto que el servidor lee
      const resp = document.getElementById('g-recaptcha-response');
      if (resp) resp.value = token;

      // También actualizar el textarea que puede existir dentro del iframe shadow
      const textareas = document.querySelectorAll('textarea[name="g-recaptcha-response"]');
      textareas.forEach(ta => { ta.value = token; });

      // Llamar el callback de grecaptcha si está disponible
      if (window.grecaptcha) {
        try {
          // Obtener el widget ID del contenedor
          const container = document.querySelector('.g-recaptcha');
          // grecaptcha.execute puede no estar disponible en v2 checkbox, pero el
          // callback registrado en data-callback sí existe si se configuró.
          // La manera más directa es disparar el callback manualmente.
          const widgetId = 0;
          if (window.___grecaptcha_cfg && window.___grecaptcha_cfg.clients) {
            const clients = window.___grecaptcha_cfg.clients;
            const clientKeys = Object.keys(clients);
            if (clientKeys.length > 0) {
              const client = clients[clientKeys[0]];
              // Buscar el callback en la estructura interna del cliente
              const cbKey = Object.keys(client).find(k => client[k] && client[k].callback);
              if (cbKey) client[cbKey].callback(token);
            }
          }
        } catch (e) {
          console.warn('grecaptcha callback no disponible, continuando con el token inyectado.');
        }
      }
    }, captchaToken);

    console.log('[MiPlanilla] Token reCAPTCHA inyectado. Enviando formulario…');

    // 4. Enviar formulario y esperar la tabla de resultados ───────────────
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null),
      page.click('#btnContinuar'),
    ]);

    // Dar tiempo adicional para que el DOM de resultados se estabilice
    await page.waitForTimeout(2000);

    // 5. Verificar si hay error en la respuesta ───────────────────────────
    const errorEl = await page.$('.alert-danger, .text-danger, [class*="error"]').catch(() => null);
    if (errorEl) {
      const errorMsg = (await errorEl.textContent()).trim();
      throw new Error(`MiPlanilla: ${errorMsg}`);
    }

    // 6. Tomar screenshot de la tabla de resultados ───────────────────────
    const fileName = `miplanilla_${docNumber}_${year}_${String(month).padStart(2, '0')}.png`;
    const filePath = path.join(screenshotDir, fileName);

    // Intentar capturar solo la tabla; si no existe capturar página completa
    const tableEl = await page.$('table, .table, [class*="result"], [class*="aporte"]').catch(() => null);

    if (tableEl) {
      await tableEl.screenshot({ path: filePath });
    } else {
      await page.screenshot({ path: filePath, fullPage: true });
    }

    console.log(`[MiPlanilla] Screenshot guardado en: ${filePath}`);
    return filePath;

  } finally {
    await browser.close();
  }
};
