document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    const capitalizeName = (name) => {
      return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Mostrar nombre en la barra superior
    const userButton = document.getElementById('user-button');
    if (usuario.nombre) {
      userButton.textContent = `👤 ${capitalizeName(usuario.nombre)}`;
    } else {
      userButton.textContent = '👤 Usuario Invitado';
    }

    // Mostrar todos los datos en el perfil
    document.getElementById('empresa-nombre').textContent = usuario.nombre || 'No registrado';
    document.getElementById('empresa-nit').textContent = usuario.nit || 'No registrado';
    document.getElementById('empresa-direccion').textContent = usuario.direccion || 'No registrado';
    document.getElementById('empresa-telefono').textContent = usuario.telefono || 'No registrado';
    document.getElementById('empresa-email').textContent = usuario.email || 'No registrado';
    document.getElementById('empresa-representante').textContent = usuario.representante || 'No registrado';
    document.getElementById('empresa-sector').textContent = usuario.sector || 'No registrado';
    document.getElementById('empresa-fecha').textContent = usuario.fechaRegistro || 'No registrado';
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
    });
  }
});
