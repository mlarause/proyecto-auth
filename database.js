const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proyecto-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    throw error;
  }
};

module.exports = { connectDB };