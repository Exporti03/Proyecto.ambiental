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

  // Modal editar datos
  const modal = document.getElementById('modalEditar');
  const formEditar = document.getElementById('formEditar');

  document.getElementById('btn-editar').addEventListener('click', () => {
    document.getElementById('input-nombre').value = usuario.nombre || '';
    document.getElementById('input-correo').value = usuario.correo || '';
    modal.style.display = 'block';
  });

  document.getElementById('btnCancelar').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoNombre = document.getElementById('input-nombre').value.trim();

    try {
      const response = await fetch(`/api/usuario/editar/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Datos actualizados correctamente');
        usuario.nombre = nuevoNombre;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        location.reload();
      } else {
        alert(data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error en el servidor');
    }
  });

  // Modal cambiar contraseña
  document.getElementById('btn-cambiar-contrasena').addEventListener('click', () => {
    document.getElementById('modalContrasena').style.display = 'block';
  });

  document.getElementById('btnCancelarContrasena').addEventListener('click', () => {
    document.getElementById('modalContrasena').style.display = 'none';
  });

  document.getElementById('formContrasena').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nueva = document.getElementById('nueva-contrasena').value;
    const confirmar = document.getElementById('confirmar-contrasena').value;

    if (nueva !== confirmar) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`/api/usuario/cambiar-contrasena/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContrasena: nueva })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Contraseña actualizada con éxito.');
        document.getElementById('modalContrasena').style.display = 'none';
      } else {
        alert(data.error || 'Error al actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('Error del servidor.');
    }
  });
});
