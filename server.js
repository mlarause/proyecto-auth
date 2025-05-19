require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// Conexión segura a MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('✅ Conexión exitosa a MongoDB'))
    .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1);
    });

// Middlewares
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});