document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario && usuario.tipo === 'personal') {
    document.getElementById('user-button').textContent = `👤 ${usuario.nombre}`;
    document.getElementById('nombre-usuario').textContent = usuario.nombre || 'No registrado';
    document.getElementById('correo-usuario').textContent = usuario.correo || 'No registrado';
    document.getElementById('tipo-usuario').textContent = usuario.tipo || 'No registrado';
    document.getElementById('registro-usuario').textContent = usuario.fechaRegistro || 'No registrado';
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
  });
});
