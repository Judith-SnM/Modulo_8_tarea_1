
import fs from 'fs/promises';

const ROOMMATES_JSON_PATH = './data/roommates.json';

export async function obtenerRoommates(req, res) {
  try {
    const data = await fs.readFile(ROOMMATES_JSON_PATH);
    const roommates = JSON.parse(data);
    res.json(roommates);
  } catch (error) {
    console.error('Error al obtener roommates:', error);
    res.status(500).send('Error interno del servidor');
  }
}

export async function agregarRoommate(req, res) {
  try {
    res.send('Agregar roommate');
  } catch (error) {
    console.error('Error al agregar roommate:', error);
    res.status(500).send('Error interno del servidor');
  }
}
