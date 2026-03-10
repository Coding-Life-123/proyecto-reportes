import mongoose from 'mongoose';

const supervisorSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  surnames: {
    type: String,
    required: [true, 'El apellido es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  driveCredentials: {
    type: mongoose.Schema.Types.Mixed
  },
  resetCode: {
    type: String
  },
  resetCodeExpiration: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Supervisor', supervisorSchema);
