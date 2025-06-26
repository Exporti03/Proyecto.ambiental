document.addEventListener('DOMContentLoaded', function () {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userButton = document.getElementById('user-button');

  // Función para capitalizar el nombre
  function capitalizeName(name) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Mostrar nombre si existe
  if (usuario && usuario.nombre) {
    userButton.textContent = `👤 ${capitalizeName(usuario.nombre)}`;
  } else {
    userButton.textContent = '👤 Usuario Invitado';
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = 'index.html';
    });
  } else {
    console.warn('No se encontró el botón de cerrar sesión (logoutBtn)');
  }
});
