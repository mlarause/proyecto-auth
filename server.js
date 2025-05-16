require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexión a MongoDB
connectDB().then(() => {
  console.log('✅ MongoDB conectado correctamente');
  
  // Importación dinámica de rutas
  const routes = [
    { path: '/api/auth', file: './routes/authRoutes' },
    { path: '/api/users', file: './routes/userRoutes' },
    { path: '/api/categories', file: './routes/categoryRoutes' }
    // Agrega aquí otras rutas
  ];

  routes.forEach(route => {
    try {
      const router = require(route.file);
      app.use(route.path, router);
      console.log(`✅ Ruta ${route.path} cargada correctamente`);
    } catch (err) {
      console.error(`⚠️ Error cargando ${route.path}:`, err.message);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('❌ Error fatal al iniciar:', err.message);
  process.exit(1);
});