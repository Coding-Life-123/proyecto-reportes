import { Router } from 'express';
import Contractor from '../models/contractorSchema.js';
import { auth } from '../middlewares/auth.js';
import {
  validateContractorId
} from '../middlewares/contractorValidator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contractor:
 *       type: object
 *       required:
 *         - names
 *         - surnames
 *         - docType
 *         - docNumber
 *         - docExpeditionDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado automáticamente por MongoDB
 *         names:
 *           type: string
 *           description: Nombres del contratista
 *         surnames:
 *           type: string
 *           description: Apellidos del contratista
 *         docType:
 *           type: string
 *           description: Tipo de documento
 *         docNumber:
 *           type: string
 *           description: Número de documento
 *         docExpeditionDate:
 *           type: string
 *           format: date
 *           description: Fecha de expedición del documento
 *         eps:
 *           type: string
 *           description: Entidad promotora de salud (opcional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * tags:
 *   name: Contractors
 *   description: API para la gestión de contratistas
 */

/**
 * @swagger
 * /api/contractors:
 *   get:
 *     summary: Obtener la lista de todos los contratistas
 *     tags: [Contractors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contratistas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contractor'
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       500:
 *         description: Error en el servidor
 */
// GET /api/contractors — Obtener todos los contratistas
router.get('/', auth, async (req, res, next) => {
  try {
    const contractors = await Contractor.find();
    return res.status(200).json(contractors);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/contractors/{id}:
 *   get:
 *     summary: Obtener un contratista por su ID
 *     tags: [Contractors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del contratista
 *     responses:
 *       200:
 *         description: Datos del contratista obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contractor'
 *       400:
 *         description: El ID de contratista proporcionado no es válido
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       404:
 *         description: Contratista no encontrado
 *       500:
 *         description: Error en el servidor
 */
// GET /api/contractors/:id — Obtener un contratista por ID
router.get('/:id', auth, validateContractorId, async (req, res, next) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }
    return res.status(200).json(contractor);
  } catch (error) {
    next(error);
  }
});

export default router;
