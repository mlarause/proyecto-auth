const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubcategorySchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);