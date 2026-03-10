export const generateResetCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};
