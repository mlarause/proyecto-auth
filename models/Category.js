const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Category', CategorySchema);