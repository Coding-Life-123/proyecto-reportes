import { Router } from 'express';
import { getReports, createReport } from '../controllers/reportController.js';
import { auth } from '../middlewares/auth.js';
import {
  validateCreateReport,
  validateReportId
} from '../middlewares/reportValidator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - contractorId
 *         - supervisorId
 *         - activeDate
 *         - inactiveDate
 *         - daysWorked
 *         - valuePerDay
 *         - totalToPay
 *         - isPaid
 *       properties:
 *         contractorId:
 *           type: string
 *           description: El ID del contratista
 *         supervisorId:
 *           type: string
 *           description: El ID del supervisor
 *         activeDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio
 *         inactiveDate:
 *           type: string
 *           format: date
 *           description: Fecha de fin
 *         daysWorked:
 *           type: number
 *           description: Días trabajados
 *         valuePerDay:
 *           type: number
 *           description: Valor por día
 *         totalToPay:
 *           type: number
 *           description: Total a pagar
 *         isPaid:
 *           type: boolean
 *           description: Estado de pago
 *         paidMonth:
 *           type: number
 *           description: Mes de pago
 *         paidYear:
 *           type: number
 *           description: Año de pago
 */
/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener todos los reportes
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del contratista
 *       - in: query
 *         name: paidMonth
 *         schema:
 *           type: number
 *         description: Filtrar por mes de pago
 *       - in: query
 *         name: paidYear
 *         schema:
 *           type: number
 *         description: Filtrar por año de pago
 *     responses:
 *       200:
 *         description: Lista de reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', auth, getReports);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Crear un nuevo reporte
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
// POST /api/reports — Crear un nuevo reporte
router.post('/', validateCreateReport, createReport);

export default router;
