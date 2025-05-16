require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');
const fs = require('fs');
const path = require('path');

const app = express();

// Conexión a DB
connectDB().then(() => {
  console.log('✅ Conexión a MongoDB establecida');
  
  // Middlewares
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Rutas básicas (obligatorias)
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));

  // Sistema de carga dinámica de rutas CRUD
  const crudRoutes = [
    { path: '/api/categories', file: 'categoryRoutes.js' },
    { path: '/api/subcategories', file: 'subcategoryRoutes.js' },
    { path: '/api/suppliers', file: 'supplierRoutes.js' },
    { path: '/api/products', file: 'productRoutes.js' }
  ];

  crudRoutes.forEach(route => {
    const routePath = path.join(__dirname, 'routes', route.file);
    if (fs.existsSync(routePath)) {
      try {
        app.use(route.path, require(`./routes/${route.file}`));
        console.log(`✅ Rutas de ${route.file} cargadas correctamente`);
      } catch (err) {
        console.error(`⚠️ Error al cargar ${route.file}:`, err.message);
      }
    } else {
      console.log(`⏩ ${route.file} no existe, se omite`);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('❌ Error fatal al conectar a MongoDB:', err.message);
  process.exit(1);
});