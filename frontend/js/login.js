document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formLogin');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const tipoCliente = document.getElementById('tipoCliente').value;

    if (!correo || !contrasena || !tipoCliente) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena, tipo: tipoCliente })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        localStorage.setItem('usuario', JSON.stringify(data.usuario)); // Guarda datos del usuario

        // Redirige según tipo
        if (data.usuario.tipo === 'personal') {
          window.location.href = 'dashboard.html';
        } else if (data.usuario.tipo === 'empresa') {
          window.location.href = 'dashboard_empresa.html';
        }

      } else {
        alert(data.error || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.error('Login error:', error);
    }
  });
});
