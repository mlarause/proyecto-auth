const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configuración inicial
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proyecto-auth')
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch(err => console.log('❌ Error de conexión a MongoDB:', err));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/suppliers', supplierRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});