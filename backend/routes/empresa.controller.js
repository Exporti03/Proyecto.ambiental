const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Actualizar datos de empresa
router.patch('/empresa/editar/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { direccion, telefono, representante, sector } = req.body;

  if (!direccion || !telefono || !representante || !sector) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar.' });
  }

  try {
    const [result] = await db.query(
      `UPDATE datos_empresas 
       SET direccion = ?, telefono = ?, responsable = ?, sector = ? 
       WHERE usuario_id = ?`,
      [direccion, telefono, representante, sector, usuarioId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró la empresa para actualizar.' });
    }

    res.json({ mensaje: 'Datos de empresa actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ error: 'Error en el servidor al actualizar empresa.' });
  }
});

// Cambiar contraseña de empresa
router.patch('/empresa/cambiar-contrasena/:id', async (req, res) => {
  const { id } = req.params;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena) {
    return res.status(400).json({ error: 'Contraseña requerida.' });
  }

  try {
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    const [result] = await db.query(
      'UPDATE usuarios SET contrasena = ? WHERE id = ? AND tipo = "empresa"',
      [hash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada.' });
    }

    res.json({ mensaje: 'Contraseña de empresa actualizada.' });
  } catch (error) {
    console.error('Error al cambiar contraseña de empresa:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
