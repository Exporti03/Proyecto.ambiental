// scripts/cifrar_contrasenas.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Conexión a tu base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',
  database: 'proyectos'
});

(async () => {
  try {
    // Buscar usuarios con contraseñas sin cifrar
    const [usuarios] = await db.query(`
      SELECT id, contrasena FROM usuarios
      WHERE contrasena NOT LIKE '$2b$%'
    `);

    if (usuarios.length === 0) {
      console.log('✅ Todas las contraseñas ya están cifradas.');
      return;
    }

    // Cifrar y actualizar cada contraseña
    for (const usuario of usuarios) {
      const hashed = await bcrypt.hash(usuario.contrasena, 10);
      await db.query(`UPDATE usuarios SET contrasena = ? WHERE id = ?`, [hashed, usuario.id]);
      console.log(`🔐 Contraseña cifrada para usuario ID ${usuario.id}`);
    }

    console.log('✅ Todas las contraseñas sin cifrar fueron actualizadas.');
  } catch (err) {
    console.error('❌ Error al actualizar contraseñas:', err.message);
  } finally {
    db.end();
  }
})();
