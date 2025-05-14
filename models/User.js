const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'coordinador', 'auxiliar'] }]
}, { 
  timestamps: true,
  // Desactiva la modificación automática del _id
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hook pre-save MODIFICADO
UserSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) return next();

  try {
    console.log('Contraseña antes de hashear:', this.password);
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Contraseña hasheada:', this.password);
    next();
  } catch (err) {
    console.error('Error al hashear:', err);
    next(err);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);