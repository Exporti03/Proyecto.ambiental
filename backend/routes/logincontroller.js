const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',
  database: 'proyectos'
});

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

    // Obtener nombre según tipo
    let nombre = 'Usuario';

    if (tipo === 'personal') {
      const [resPersonal] = await db.query('SELECT nombre FROM datos_personales WHERE usuario_id = ?', [usuario.id]);
      if (resPersonal.length > 0) {
        nombre = resPersonal[0].nombre;
      }
    } else if (tipo === 'empresa') {
      const [resEmpresa] = await db.query('SELECT nombre_empresa AS nombre FROM datos_empresas WHERE usuario_id = ?', [usuario.id]);
      if (resEmpresa.length > 0) {
        nombre = resEmpresa[0].nombre;
      }
    }

    // Enviar datos seguros, incluyendo nombre
    const usuarioSeguro = {
      id: usuario.id,
      correo: usuario.correo,
      tipo: usuario.tipo,
      nombre: nombre
    };

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: usuarioSeguro });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error en el servidor', detalles: error.message });
  }
});

module.exports = router;
