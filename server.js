require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');

const app = express();

// Conexión a DB con manejo de errores mejorado
connectDB().then(() => {
  console.log('Conexión a MongoDB establecida');
  
  // Middlewares
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Rutas básicas (siempre presentes)
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));

  // Rutas CRUD (solo si existen los archivos)
  try {
    app.use('/api/categories', require('./routes/categoryRoutes'));
    console.log('Rutas de categorías cargadas');
  } catch (err) {
    console.log('No se cargaron rutas de categorías:', err.message);
  }

  try {
    app.use('/api/subcategories', require('./routes/subcategoryRoutes'));
    console.log('Rutas de subcategorías cargadas');
  } catch (err) {
    console.log('No se cargaron rutas de subcategorías:', err.message);
  }

  try {
    app.use('/api/suppliers', require('./routes/supplierRoutes'));
    console.log('Rutas de proveedores cargadas');
  } catch (err) {
    console.log('No se cargaron rutas de proveedores:', err.message);
  }

  try {
    app.use('/api/products', require('./routes/productRoutes'));
    console.log('Rutas de productos cargadas');
  } catch (err) {
    console.log('No se cargaron rutas de productos:', err.message);
  }

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });

}).catch(err => {
  console.error('Error fatal al conectar a MongoDB:', err);
  process.exit(1); // Salir si no hay conexión a DB
});