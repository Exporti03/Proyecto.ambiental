// backend/routes/registroController.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',  // Ajusta a tu contraseña real
  database: 'proyecto'
});

router.post('/registrar', async (req, res) => {
  try {
    const { tipo, correo, contrasena, nombreCompleto, razonSocial, nit, representanteLegal, direccion, telefono } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);

    const [usuarioResult] = await db.query(
      'INSERT INTO usuarios (correo, contraseña, tipo) VALUES (?, ?, ?)',
      [correo, hash, tipo]
    );

    const usuario_id = usuarioResult.insertId;

    if (tipo === 'personal') {
      await db.query(
        'INSERT INTO datos_personales (usuario_id, nombre) VALUES (?, ?)',
        [usuario_id, nombreCompleto]
      );
    } else if (tipo === 'empresa') {
      await db.query(
        'INSERT INTO datos_empresas (usuario_id, nombre_empresa, nit, responsable, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, razonSocial, nit, representanteLegal, telefono, direccion]
      );
    }

    res.status(200).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

module.exports = router;
