require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// Conexión a MongoDB
mongoose.connect(config.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta básica
app.get('/', (req, res) => {
    res.send('API is working');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});