const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./api/routes/authRouter');
const { School } = require('./api/models/authModels');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const baseUrl = process.env.API_BASE_URL || 'http://localhost:5173';

// Перевірка змінних середовища
const validateEnvVariables = () => {
  if (!MONGODB_URL || !JWT_SECRET_KEY) {
    console.error('Missing required environment variables in .env file.');
    process.exit(1);
  }
};
validateEnvVariables();

// Middleware
app.use(cors());
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Маршрути
app.get('/', (req, res) => {
  res.send('Welcome to the Todo App');
});
app.post('/api/auth/registerSchoolAndAdmin', async (req, res) => {
  console.log('Received data:', req.body);
  try {
    // Створення нової школи
    const newSchool = await School.create({
      name: req.body.schoolName,
      address: req.body.schoolAddress,
      email: req.body.schoolEmail,
      mainAdmin: req.body.adminName, // або інше поле для адміністратора
    });
    // Створення нового адміністратора
    const newAdmin = await Admin.create({
      name: req.body.adminName,
      email: req.body.adminEmail,
      password: req.body.adminPassword, // Переконайтеся, що пароль хешується
      role: req.body.adminRole,
      school: newSchool._id, // Зв'язок з школою
    });

    // Відповідь
    res.status(201).json({ user: newAdmin, school: newSchool });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.use('/api/auth', authRouter);

// Підключення до MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Помилка 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
