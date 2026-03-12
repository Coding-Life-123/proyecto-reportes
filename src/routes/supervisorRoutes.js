import { Router } from 'express';
import {
  loginSupervisor,
  requestResetCode,
  resetPassword
} from '../controllers/supervisorController.js';
import {
  validateLoginSupervisor,
  validateResetCodeRequest,
  validateResetPassword
} from '../middlewares/supervisorValidator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Supervisors
 *   description: API para la gestión de supervisores
 */

/**
 * @swagger
 * /api/supervisors/login:
 *   post:
 *     summary: Iniciar sesión como supervisor
 *     tags: [Supervisors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del supervisor
 *               password:
 *                 type: string
 *                 description: Contraseña del supervisor
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 supervisor:
 *                   type: object
 *                   description: Datos del supervisor
 *       400:
 *         description: Credenciales inválidas o datos de entrada incorrectos
 *       500:
 *         description: Error en el servidor
 */
// POST /api/supervisors/login — Iniciar sesión
router.post('/login', validateLoginSupervisor, loginSupervisor);

/**
 * @swagger
 * /api/supervisors/reset-code:
 *   post:
 *     summary: Solicitar código de recuperación de contraseña
 *     tags: [Supervisors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del supervisor
 *     responses:
 *       200:
 *         description: Código de recuperación enviado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Supervisor no encontrado
 *       500:
 *         description: Error en el servidor al enviar el correo
 */
// POST /api/supervisors/reset-code — Solicitar código de recuperación de contraseña
router.post('/reset-code', validateResetCodeRequest, requestResetCode);

/**
 * @swagger
 * /api/supervisors/reset-password:
 *   post:
 *     summary: Cambiar contraseña con el código recibido
 *     tags: [Supervisors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - resetCode
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del supervisor
 *               resetCode:
 *                 type: string
 *                 description: Código de recuperación enviado al correo
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña (mínimo 8 caracteres)
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Datos inválidos o código incorrecto/expirado
 *       404:
 *         description: Supervisor no encontrado
 *       500:
 *         description: Error en el servidor
 */
// POST /api/supervisors/reset-password — Cambiar contraseña con el código recibido
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
