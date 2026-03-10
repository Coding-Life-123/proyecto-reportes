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

// Validaciones para crear un reporte
export const validateCreateReport = [
  // --- Campos requeridos ---
  body('supervisorId')
    .notEmpty().withMessage('El ID del supervisor es obligatorio')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del supervisor no es válido'),

  body('contractorId')
    .notEmpty().withMessage('El ID del contratista es obligatorio')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del contratista no es válido'),

  body('selectedPlatform')
    .notEmpty().withMessage('La plataforma seleccionada es obligatoria')
    .isString().withMessage('La plataforma debe ser una cadena de texto'),

  // --- Campos opcionales: solo se validan si llegan con un valor real ---
  body('paidMonth')
    .optional({ nullable: true })
    .isString().withMessage('El mes de pago debe ser una cadena de texto'),

  body('paidYear')
    .optional({ nullable: true })
    .isInt({ min: 2000, max: 2100 }).withMessage('El año de pago debe ser un número entero válido'),

  body('status')
    .optional({ nullable: true })
    .isIn(['pending', 'error', 'completed']).withMessage('El estado debe ser: pending, error o completed'),

  body('fileUrl')
    .optional({ nullable: true })
    .isURL().withMessage('El fileUrl debe ser una URL válida'),

  body('templNumber')
    .optional({ nullable: true })
    .isString().withMessage('El número de plantilla debe ser una cadena de texto'),

  body('templValue')
    .optional({ nullable: true })
    .isNumeric().withMessage('El valor de la plantilla debe ser un número'),

  body('templPayDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('La fecha de pago de plantilla debe tener formato ISO 8601 (YYYY-MM-DD)'),

  body('reportType')
    .optional({ nullable: true })
    .isString().withMessage('El tipo de reporte debe ser una cadena de texto'),

  handleValidationErrors
];

// Validaciones para actualizar un reporte (todos los campos son opcionales)
export const validateUpdateReport = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del reporte en la URL no es válido'),

  body('supervisorId')
    .optional({ nullable: true })
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del supervisor no es válido'),

  body('contractorId')
    .optional({ nullable: true })
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del contratista no es válido'),

  body('selectedPlatform')
    .optional({ nullable: true })
    .isString().withMessage('La plataforma debe ser una cadena de texto'),

  body('paidMonth')
    .optional({ nullable: true })
    .isString().withMessage('El mes de pago debe ser una cadena de texto'),

  body('paidYear')
    .optional({ nullable: true })
    .isInt({ min: 2000, max: 2100 }).withMessage('El año de pago debe ser un número entero válido'),

  body('status')
    .optional({ nullable: true })
    .isIn(['pending', 'error', 'completed']).withMessage('El estado debe ser: pending, error o completed'),

  body('fileUrl')
    .optional({ nullable: true })
    .isURL().withMessage('El fileUrl debe ser una URL válida'),

  body('templNumber')
    .optional({ nullable: true })
    .isString().withMessage('El número de plantilla debe ser una cadena de texto'),

  body('templValue')
    .optional({ nullable: true })
    .isNumeric().withMessage('El valor de la plantilla debe ser un número'),

  body('templPayDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('La fecha de pago de plantilla debe tener formato ISO 8601 (YYYY-MM-DD)'),

  body('reportType')
    .optional({ nullable: true })
    .isString().withMessage('El tipo de reporte debe ser una cadena de texto'),

  handleValidationErrors
];

// Validación de ID en parámetros de ruta
export const validateReportId = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del reporte no es válido'),

  handleValidationErrors
];
