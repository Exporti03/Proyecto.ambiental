const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',
  database: 'proyectos'
});

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena, tipo } = req.body;

    if (!correo || !contrasena || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ? AND tipo = ?', [correo, tipo]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o tipo incorrecto' });
    }

    const usuario = rows[0];
    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Enviar información básica sin contraseña
    const usuarioSeguro = {
      id: usuario.id,
      correo: usuario.correo,
      tipo: usuario.tipo
    };

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: usuarioSeguro });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error en el servidor', detalles: error.message });
  }
});

module.exports = router;
