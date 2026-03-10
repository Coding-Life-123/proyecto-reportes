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

// POST /api/supervisors/login — Iniciar sesión
router.post('/login', validateLoginSupervisor, loginSupervisor);

// POST /api/supervisors/reset-code — Solicitar código de recuperación de contraseña
router.post('/reset-code', validateResetCodeRequest, requestResetCode);

// POST /api/supervisors/reset-password — Cambiar contraseña con el código recibido
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
