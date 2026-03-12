import { runScraper } from './playwrightService.js';

export const getContractorPlanilla = async (contractor) => {
  return runScraper(async (page) => {
    await page.goto('https://url-del-portal-seguro-social.gov.co');

    // Llenar formulario con datos del contratista
    await page.fill('#tipoDocumento', contractor.docType);
    await page.fill('#numDocumento', contractor.docNumber);
    await page.click('#btnBuscar');

    // Esperar a que cargue el resultado
    await page.waitForSelector('.resultado-planilla');

    // Descargar PDF o capturar como PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    return pdfBuffer; // retornar el buffer para subirlo a Drive
  });
};
