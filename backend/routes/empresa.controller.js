const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // Para cifrar la contraseña

// ✅ Obtener listado de todas las empresas
router.get('/empresas', async (req, res) => {
  try {
    const [empresas] = await db.query(`
      SELECT de.usuario_id AS id, de.nombre_empresa AS nombre, de.nit, de.direccion, 
             de.telefono, de.sector, u.correo AS email
      FROM datos_empresas de
      JOIN usuarios u ON de.usuario_id = u.id
    `);
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

// ✅ Asociar usuario con empresa
router.post('/asociar', async (req, res) => {
  const { usuario_id, empresa_id } = req.body;

  if (!usuario_id || !empresa_id) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const [existente] = await db.query(
      `SELECT * FROM empresa_clientes WHERE cliente_id = ? AND empresa_id = ?`,
      [usuario_id, empresa_id]
    );

    if (existente.length > 0) {
      return res.status(409).json({ error: 'Ya existe una solicitud o relación.' });
    }

    await db.query(
      `INSERT INTO empresa_clientes (empresa_id, cliente_id, estado)
       VALUES (?, ?, 'Pendiente')`,
      [empresa_id, usuario_id]
    );

    res.json({ mensaje: 'Solicitud de asociación enviada.' });
  } catch (error) {
    console.error('Error al asociar empresa:', error);
    res.status(500).json({ error: 'Error al asociar empresa' });
  }
});

// ✅ Obtener empresas asociadas a un usuario
router.get('/usuarios/:usuarioId/empresas', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT de.nombre_empresa AS nombre, de.nit, u.correo AS email, ec.estado
      FROM empresa_clientes ec
      JOIN datos_empresas de ON ec.empresa_id = de.usuario_id
      JOIN usuarios u ON u.id = de.usuario_id
      WHERE ec.cliente_id = ?
    `, [usuarioId]);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener empresas asociadas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ Obtener solicitudes pendientes de una empresa
router.get('/empresa/:empresaId/solicitudes', async (req, res) => {
  const { empresaId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT dp.nombre, u.correo, u.id
      FROM empresa_clientes ec
      JOIN usuarios u ON ec.cliente_id = u.id
      JOIN datos_personales dp ON dp.usuario_id = u.id
      WHERE ec.empresa_id = ? AND ec.estado = 'Pendiente'
    `, [empresaId]);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ Aceptar solicitud
router.post('/empresa/:empresaId/solicitud/:clienteId/aceptar', async (req, res) => {
  const { empresaId, clienteId } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE empresa_clientes SET estado = 'Aceptado'
       WHERE empresa_id = ? AND cliente_id = ?`,
      [empresaId, clienteId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({ mensaje: 'Solicitud aceptada.' });
  } catch (error) {
    console.error('Error al aceptar solicitud:', error);
    res.status(500).json({ error: 'Error al aceptar solicitud.' });
  }
});

// ✅ Rechazar solicitud
router.post('/empresa/:empresaId/solicitud/:clienteId/rechazar', async (req, res) => {
  const { empresaId, clienteId } = req.params;

  try {
    await db.query(
      `DELETE FROM empresa_clientes WHERE empresa_id = ? AND cliente_id = ?`,
      [empresaId, clienteId]
    );

    res.json({ mensaje: 'Solicitud rechazada.' });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ error: 'Error al rechazar solicitud.' });
  }
});

// ✅ Obtener clientes aceptados de una empresa
router.get('/empresa/:empresaId/clientes', async (req, res) => {
  const { empresaId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT dp.nombre, u.correo
      FROM empresa_clientes ec
      JOIN usuarios u ON ec.cliente_id = u.id
      JOIN datos_personales dp ON dp.usuario_id = u.id
      WHERE ec.empresa_id = ? AND ec.estado = 'Aceptado'
    `, [empresaId]);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener clientes asociados:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ Editar datos de la empresa
router.patch('/empresa/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { direccion, telefono, representante, sector } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE datos_empresas 
       SET direccion = ?, telefono = ?, responsable = ?, sector = ?
       WHERE usuario_id = ?`,
      [direccion, telefono, representante, sector, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar datos de empresa:', error);
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
});

// ✅ Cambiar contraseña de empresa (CORREGIDO CON BCRYPT)
router.patch('/empresa/cambiar-contrasena/:id', async (req, res) => {
  const { id } = req.params;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena || nuevaContrasena.length < 6) {
    return res.status(400).json({ error: 'Contraseña inválida o muy corta' });
  }

  try {
    const hash = await bcrypt.hash(nuevaContrasena, 10); // 🔐 Cifrar la nueva contraseña

    const [result] = await db.query(
      `UPDATE usuarios SET contrasena = ? WHERE id = ? AND tipo = 'empresa'`,
      [hash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;
