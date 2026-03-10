import { Router } from 'express';
import { getReports, createReport } from '../controllers/reportController.js';
import { auth } from '../middlewares/auth.js';
import {
  validateCreateReport,
  validateReportId
} from '../middlewares/reportValidator.js';

const router = Router();

// GET /api/reports  — Obtener todos los reportes (con filtros opcionales: name, paidMonth, paidYear)
router.get('/', auth, getReports);

// POST /api/reports — Crear un nuevo reporte
router.post('/', auth, validateCreateReport, createReport);

export default router;
