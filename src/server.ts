import express from 'express';
import paypalRoutes from './routes/paypalRoutes';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/paypal', paypalRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});