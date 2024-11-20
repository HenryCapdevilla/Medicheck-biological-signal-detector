import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from '../routes/auth.routes.js';
import taskRoutes from '../routes/task.routes.js';

const app = express();

app.use(cors({
    origin: "*", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    credentials: true,  // Si usas cookies o autenticación basada en sesión
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/api', taskRoutes);

export default app;