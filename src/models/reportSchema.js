import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: [true, 'El ID del supervisor es obligatorio']
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: [true, 'El ID del contratista es obligatorio']
  },
  selectedPlatform: {
    type: String,
    required: [true, 'La plataforma seleccionada es obligatoria']
  },
  paidMonth: {
    type: String
  },
  paidYear: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'error', 'completed'],
    default: 'pending'
  },
  fileUrl: {
    type: String
  },
  templNumber: {
    type: String
  },
  templValue: {
    type: Number
  },
  templPayDate: {
    type: Date
  },
  reportType: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
