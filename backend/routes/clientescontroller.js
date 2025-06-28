// clientescontroller.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener clientes asociados a una empresa
router.get('/empresa/clientes/:empresaId', async (req, res) => {
  const { empresaId } = req.params;

  try {
    const [clientes] = await db.query(`
      SELECT u.id, dp.nombre, u.correo
      FROM empresa_clientes ec
      JOIN usuarios u ON u.id = ec.cliente_id
      LEFT JOIN datos_personales dp ON dp.usuario_id = u.id
      WHERE ec.empresa_id = ? AND u.tipo = 'personal'
    `, [empresaId]);

    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Asociar un nuevo cliente a la empresa
router.post('/empresa/asociar-cliente', async (req, res) => {
  const { empresaId, clienteCorreo } = req.body;

  try {
    const [clientes] = await db.query(
      'SELECT id FROM usuarios WHERE correo = ? AND tipo = "personal"',
      [clienteCorreo]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const clienteId = clientes[0].id;

    // Evitar duplicados
    const [existe] = await db.query(
      'SELECT * FROM empresa_clientes WHERE empresa_id = ? AND cliente_id = ?',
      [empresaId, clienteId]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: 'Cliente ya asociado' });
    }

    await db.query(
      'INSERT INTO empresa_clientes (empresa_id, cliente_id) VALUES (?, ?)',
      [empresaId, clienteId]
    );

    res.json({ mensaje: 'Cliente asociado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asociar cliente' });
  }
});

module.exports = router;
