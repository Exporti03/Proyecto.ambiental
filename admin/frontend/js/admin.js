document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', () => {
    alert('Sesión cerrada correctamente.');
    // Aquí puedes hacer una redirección o limpieza de sesión.
    window.location.href = '/login.html'; // Cambia según tu ruta real
  });
});
