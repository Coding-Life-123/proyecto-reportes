import Supervisor from '../models/supervisorSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateResetCode } from '../utils/generateResetCode.js';
import { sendResetCodeEmail } from '../utils/nodemailer.js';

export const loginSupervisor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const supervisor = await Supervisor.findOne({ email });
    if (!supervisor) {
      return res.status(401).json({ message: 'Email o contraseña incorrecta' });
    }

    const isMatch = await bcrypt.compare(password, supervisor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: supervisor._id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    next(error);
  }
};

export const requestResetCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const supervisor = await Supervisor.findOne({ email });
    if (!supervisor) {
      return res.status(200).json({ message: 'Si el email existe, se enviará un código de verificación' });
    }

    const resetCode = generateResetCode();
    const resetCodeExpiration = new Date(Date.now() + 15 * 60 * 1000);

    supervisor.resetCode = resetCode;
    supervisor.resetCodeExpiration = resetCodeExpiration;
    await supervisor.save();

    await sendResetCodeEmail(email, resetCode);

    return res.status(200).json({ message: 'Si el email existe, se enviará un código de verificación' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const supervisor = await Supervisor.findOne({ email, resetCode });
    if (!supervisor) {
      return res.status(400).json({ message: 'Código inválido' });
    }

    if (supervisor.resetCodeExpiration < new Date()) {
      return res.status(400).json({ message: 'Error, código expirado' });
    }

    supervisor.password = await bcrypt.hash(newPassword, 10);
    supervisor.resetCode = undefined;
    supervisor.resetCodeExpiration = undefined;
    await supervisor.save();

    return res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    next(error);
  }
};
