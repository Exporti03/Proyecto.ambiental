document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    const userButton = document.getElementById('user-button');
    userButton.textContent = `👤 ${usuario.nombre || 'Usuario'}`;

    document.getElementById('empresa-nombre').textContent = usuario.nombre || 'No registrado';
    document.getElementById('empresa-nit').textContent = usuario.nit || 'No registrado';
    document.getElementById('empresa-direccion').textContent = usuario.direccion || 'No registrado';
    document.getElementById('empresa-telefono').textContent = usuario.telefono || 'No registrado';
    document.getElementById('empresa-email').textContent = usuario.correo || 'No registrado';
    document.getElementById('empresa-representante').textContent = usuario.representante || 'No registrado';
    document.getElementById('empresa-sector').textContent = usuario.sector || 'No registrado';
    document.getElementById('empresa-fecha').textContent = usuario.fechaRegistro || 'No registrado';
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
  });
});
