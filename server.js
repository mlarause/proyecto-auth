require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./database');
const mongoose = require('mongoose');

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Manejo mejorado de conexión a MongoDB
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB conectado exitosamente');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
});

// Importación de rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Asignación de rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API Proyecto-Auth funcionando',
    status: 'OK' 
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: err.message 
  });
});

// Inicialización del servidor
const startServer = async () => {
  try {
    await connectDB(); // Conexión a la base de datos
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error fatal al iniciar:', error.message);
    process.exit(1);
  }
};

startServer();