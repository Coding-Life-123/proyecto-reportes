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

// Validaciones para crear un contratista
export const validateCreateContractor = [
  // --- Campos requeridos ---
  body('names')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser una cadena de texto'),

  body('surnames')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser una cadena de texto'),

  body('docType')
    .notEmpty().withMessage('El tipo de documento es obligatorio')
    .isString().withMessage('El tipo de documento debe ser una cadena de texto'),

  body('docNumber')
    .notEmpty().withMessage('El número de documento es obligatorio')
    .isString().withMessage('El número de documento debe ser una cadena de texto'),

  body('docExpeditionDate')
    .notEmpty().withMessage('La fecha de expedición es obligatoria')
    .isISO8601().withMessage('La fecha de expedición debe tener formato ISO 8601 (YYYY-MM-DD)'),

  // --- Campo opcional: solo se valida si llega con un valor real ---
  body('eps')
    .optional({ nullable: true })
    .isString().withMessage('La EPS debe ser una cadena de texto'),

  handleValidationErrors
];

// Validaciones para actualizar un contratista
export const validateUpdateContractor = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del contratista en la URL no es válido'),

  body('names')
    .optional({ nullable: true })
    .isString().withMessage('El nombre debe ser una cadena de texto'),

  body('surnames')
    .optional({ nullable: true })
    .isString().withMessage('El apellido debe ser una cadena de texto'),

  body('docType')
    .optional({ nullable: true })
    .isString().withMessage('El tipo de documento debe ser una cadena de texto'),

  body('docNumber')
    .optional({ nullable: true })
    .isString().withMessage('El número de documento debe ser una cadena de texto'),

  body('docExpeditionDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('La fecha de expedición debe tener formato ISO 8601 (YYYY-MM-DD)'),

  body('eps')
    .optional({ nullable: true })
    .isString().withMessage('La EPS debe ser una cadena de texto'),

  handleValidationErrors
];

// Validación de ID en parámetros de ruta
export const validateContractorId = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del contratista no es válido'),

  handleValidationErrors
];
