import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import swaggerUiExpress from 'swagger-ui-express';
import swaggerSpecs from './config/swaggerOptions.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'
import errorHandler from './middlewares/errors/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT||8080;
process.env.NODE_ENV === 'test' 
  ? mongoose.connect('mongodb://localhost:27017/test') //si se quiere correr localmente
  : mongoose.connect('mongodb+srv://ericdati30:Ciclon3840%25@cluster0.2b3mjna.mongodb.net/Curso3?retryWrites=true&w=majority&appName=Cluster0') // Si fuera una base productiva

console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(cookieParser());

//console.log(swaggerSpecs);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs))

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.use(errorHandler); // Puede ser util comentar esto cuando se crea nuevo codigo sin saber los posibles errores, ya que si no se encuentra una excepcion manejada, dara undefined y va a esconder el error

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

export default app;