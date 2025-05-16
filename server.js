require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexión a DB y rutas
connectDB().then(() => {
  console.log('✅ MongoDB conectado');
  
  // Rutas
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/subcategories', require('./routes/subcategoryRoutes'));
  app.use('/api/products', require('./routes/productRoutes'));
  app.use('/api/suppliers', require('./routes/supplierRoutes'));

  // Ruta de prueba
  app.get('/', (req, res) => {
    res.json({ status: 'API funcionando' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});