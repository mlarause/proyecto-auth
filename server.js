require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');

const app = express();

// Configuración mejorada de conexión a DB
connectDB().then(() => {
  // Middlewares
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Rutas
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/auth', require('./routes/authRoutes'));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo iniciar la aplicación:', err);
});