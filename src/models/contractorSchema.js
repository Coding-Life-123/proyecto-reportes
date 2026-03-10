import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  surnames: {
    type: String,
    required: [true, 'El apellido es obligatorio']
  },
  docType: {
    type: String,
    required: [true, 'El tipo de documento es obligatorio']
  },
  docNumber: {
    type: String,
    required: [true, 'El número de documento es obligatorio']
  },
  docExpeditionDate: {
    type: Date,
    required: [true, 'La fecha de expedición es obligatoria']
  },
  eps: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Contractor', contractorSchema);
