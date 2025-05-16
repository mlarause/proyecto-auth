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

  // Rutas básicas
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));

  // Carga dinámica de rutas CRUD con validación
  const crudRoutes = [
    { path: '/api/categories', file: 'categoryRoutes' },
    { path: '/api/subcategories', file: 'subcategoryRoutes' },
    { path: '/api/suppliers', file: 'supplierRoutes' },
    { path: '/api/products', file: 'productRoutes' }
  ];

  crudRoutes.forEach(({ path: routePath, file }) => {
    const filePath = `./routes/${file}`;
    try {
      if (fs.existsSync(`${__dirname}/routes/${file}.js`)) {
        const router = require(filePath);
        if (typeof router === 'function') {
          app.use(routePath, router);
          console.log(`✅ Rutas de ${file}.js cargadas correctamente`);
        } else {
          console.log(`⚠️ El archivo ${file}.js no exporta un router válido`);
        }
      } else {
        console.log(`⏩ ${file}.js no existe, se omite`);
      }
    } catch (err) {
      console.error(`❌ Error al cargar ${file}.js:`, err.message);
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