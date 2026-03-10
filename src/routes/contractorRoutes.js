import { Router } from 'express';
import Contractor from '../models/contractorSchema.js';
import { auth } from '../middlewares/auth.js';
import {
  validateContractorId
} from '../middlewares/contractorValidator.js';

const router = Router();

// GET /api/contractors — Obtener todos los contratistas
router.get('/', auth, async (req, res, next) => {
  try {
    const contractors = await Contractor.find();
    return res.status(200).json(contractors);
  } catch (error) {
    next(error);
  }
});

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
