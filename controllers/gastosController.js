import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { sendEmail } from '../utils/sendEmail.js';

const gastosFile = process.env.GASTOS_FILE;
const roommatesFile = process.env.DB_FILE;

export const getGastos = async (req, res) => {
  try {
    const data = await fs.readFile(gastosFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
};

export const addGasto = async (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body;
    const newGasto = {
      id: uuidv4(),
      roommate,
      descripcion,
      monto
    };

    const gastosData = await fs.readFile(gastosFile, 'utf-8');
    const gastos = JSON.parse(gastosData);
    gastos.push(newGasto);

    await fs.writeFile(gastosFile, JSON.stringify(gastos, null, 2));
    res.status(201).json(newGasto);

    // Update roommates balances
    const roommatesData = await fs.readFile(roommatesFile, 'utf-8');
    const roommates = JSON.parse(roommatesData);

    const roommateIndex = roommates.findIndex(r => r.nombre === roommate);
    if (roommateIndex !== -1) {
      roommates[roommateIndex].debe += monto;
    }

    await fs.writeFile(roommatesFile, JSON.stringify(roommates, null, 2));

    // Send email to roommates
    await sendEmail(roommates, newGasto);
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
};

export const updateGasto = async (req, res) => {
  try {
    const { id, roommate, descripcion, monto } = req.body;

    const gastosData = await fs.readFile(gastosFile, 'utf-8');
    const gastos = JSON.parse(gastosData);

    const gastoIndex = gastos.findIndex(g => g.id === id);
    if (gastoIndex === -1) {
      return res.status(404).send('Gasto no encontrado');
    }

    gastos[gastoIndex] = { id, roommate, descripcion, monto };

    await fs.writeFile(gastosFile, JSON.stringify(gastos, null, 2));
    res.json(gastos[gastoIndex]);

    // Recalculate roommates balances
    const roommatesData = await fs.readFile(roommatesFile, 'utf-8');
    const roommates = JSON.parse(roommatesData);

    roommates.forEach(r => {
      r.debe = 0;
      r.recibe = 0;
    });

    gastos.forEach(g => {
      const roommateIndex = roommates.findIndex(r => r.nombre === g.roommate);
      if (roommateIndex !== -1) {
        roommates[roommateIndex].debe += g.monto;
      }
    });

    await fs.writeFile(roommatesFile, JSON.stringify(roommates, null, 2));
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
};

export const deleteGasto = async (req, res) => {
  try {
    const { id } = req.query;

    const gastosData = await fs.readFile(gastosFile, 'utf-8');
    const gastos = JSON.parse(gastosData);

    const gastoIndex = gastos.findIndex(g => g.id === id);
    if (gastoIndex === -1) {
      return res.status(404).send('Gasto no encontrado');
    }

    gastos.splice(gastoIndex, 1);

    await fs.writeFile(gastosFile, JSON.stringify(gastos, null, 2));
    res.json({ message: 'Gasto eliminado' });

    // Recalculate roommates balances
    const roommatesData = await fs.readFile(roommatesFile, 'utf-8');
    const roommates = JSON.parse(roommatesData);

    roommates.forEach(r => {
      r.debe = 0;
      r.recibe = 0;
    });

    gastos.forEach(g => {
      const roommateIndex = roommates.findIndex(r => r.nombre === g.roommate);
      if (roommateIndex !== -1) {
        roommates[roommateIndex].debe += g.monto;
      }
    });

    await fs.writeFile(roommatesFile, JSON.stringify(roommates, null, 2));
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
};
