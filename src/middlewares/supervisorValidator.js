import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Helper para retornar los errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para registrar un supervisor
export const validateCreateSupervisor = [
  // --- Campos requeridos ---
  body('names')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser una cadena de texto'),

  body('surnames')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser una cadena de texto'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

  // --- Campos opcionales: solo se validan si llegan con un valor real ---
  body('driveCredentials')
    .optional({ nullable: true })
    .isObject().withMessage('Las credenciales de Drive deben ser un objeto válido'),

  handleValidationErrors
];

// Validaciones para actualizar un supervisor
export const validateUpdateSupervisor = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del supervisor en la URL no es válido'),

  body('names')
    .optional({ nullable: true })
    .isString().withMessage('El nombre debe ser una cadena de texto'),

  body('surnames')
    .optional({ nullable: true })
    .isString().withMessage('El apellido debe ser una cadena de texto'),

  body('email')
    .optional({ nullable: true })
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('password')
    .optional({ nullable: true })
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

  body('driveCredentials')
    .optional({ nullable: true })
    .isObject().withMessage('Las credenciales de Drive deben ser un objeto válido'),

  handleValidationErrors
];

// Validaciones para login de supervisor
export const validateLoginSupervisor = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),

  handleValidationErrors
];

// Validaciones para solicitar reset de contraseña
export const validateResetCodeRequest = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  handleValidationErrors
];

// Validaciones para cambiar la contraseña con el código de reset
export const validateResetPassword = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),

  body('resetCode')
    .notEmpty().withMessage('El código de recuperación es obligatorio')
    .isString().withMessage('El código de recuperación debe ser una cadena de texto'),

  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors
];

// Validación de ID en parámetros de ruta
export const validateSupervisorId = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del supervisor no es válido'),

  handleValidationErrors
];
