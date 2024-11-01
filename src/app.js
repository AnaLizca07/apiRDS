require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));