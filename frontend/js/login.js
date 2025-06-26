document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formLogin');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const tipoCliente = document.getElementById('tipoCliente').value;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena, tipo: tipoCliente })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje || 'Inicio de sesión exitoso');
        window.location.href = 'dashboard.html';
      } else {
        alert(data.error || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.error(error);
    }
  });
});
