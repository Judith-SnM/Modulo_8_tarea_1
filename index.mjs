import { obtenerRoommates, agregarRoommate } from './controllers/roommatesController.js';

import express from 'express';
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/roommates', obtenerRoommates);

app.post('/roommate', agregarRoommate);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
