const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// 📄 Obtener datos del usuario personal
router.get('/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT nombre, correo, tipo, fecha_registro 
       FROM datos_personales 
       INNER JOIN usuarios ON datos_personales.usuario_id = usuarios.id 
       WHERE usuario_id = ?`,
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 📝 Actualizar nombre del usuario personal
router.patch('/usuario/editar/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio.' });
  }

  try {
    const [result] = await db.query(
      `UPDATE datos_personales SET nombre = ? WHERE usuario_id = ?`,
      [nombre, usuarioId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Datos del usuario actualizados correctamente.' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
});

// 🔐 Cambiar contraseña del usuario personal
router.patch('/usuario/cambiar-contrasena/:id', async (req, res) => {
  const { id } = req.params;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena) {
    return res.status(400).json({ message: 'Contraseña requerida.' });
  }

  try {
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    const [result] = await db.query(
      'UPDATE usuarios SET contrasena = ? WHERE id = ? AND tipo = "personal"',
      [hash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Contraseña de usuario actualizada.' });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;

