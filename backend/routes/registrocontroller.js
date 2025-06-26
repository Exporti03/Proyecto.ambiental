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

router.post('/registrar', async (req, res) => {
  try {
    const {
      tipo,
      correo,
      contrasena,
      nombreCompleto,
      razonSocial,
      nit,
      representanteLegal,
      direccion,
      telefono
    } = req.body;

    if (!tipo || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (tipo, correo, contraseña).' });
    }

    if (tipo !== 'personal' && tipo !== 'empresa') {
      return res.status(400).json({ error: 'Tipo debe ser "personal" o "empresa".' });
    }

    if (tipo === 'personal' && !nombreCompleto) {
      return res.status(400).json({ error: 'Falta nombre completo para tipo personal.' });
    }

    if (tipo === 'empresa' && (!razonSocial || !nit || !representanteLegal || !direccion || !telefono)) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para tipo empresa.' });
    }

    // Verificar si el correo ya existe
    const [usuariosExistentes] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar en la tabla usuarios
    const [usuarioResult] = await db.query(
      'INSERT INTO usuarios (correo, contrasena, tipo) VALUES (?, ?, ?)',
      [correo, hash, tipo]
    );

    const usuario_id = usuarioResult.insertId;

    // Insertar datos adicionales según el tipo
    if (tipo === 'personal') {
      await db.query(
        'INSERT INTO datos_personales (usuario_id, nombre) VALUES (?, ?)',
        [usuario_id, nombreCompleto]
      );
    } else {
      await db.query(
        'INSERT INTO datos_empresas (usuario_id, nombre_empresa, nit, responsable, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, razonSocial, nit, representanteLegal, telefono, direccion]
      );
    }

    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error('Error en /registrar:', error);
    res.status(500).json({ error: 'Error al registrar el usuario', detalles: error.message });
  }
});

module.exports = router;
