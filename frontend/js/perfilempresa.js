document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const userButton = document.getElementById('user-button');
  const empresaNombre = document.getElementById('empresa-nombre');
  const empresaNit = document.getElementById('empresa-nit');
  const empresaDireccionText = document.getElementById('empresa-direccion-text');
  const empresaTelefonoText = document.getElementById('empresa-telefono-text');
  const empresaEmail = document.getElementById('empresa-email');
  const empresaRepresentanteText = document.getElementById('empresa-representante-text');
  const empresaSectorText = document.getElementById('empresa-sector-text');
  const empresaFecha = document.getElementById('empresa-fecha');

  const modal = document.getElementById('modalEditar');
  const btnEditar = document.getElementById('btn-editar');
  const btnCancelar = document.getElementById('btnCancelar');
  const formEditar = document.getElementById('formEditar');

  const inputDireccion = document.getElementById('input-direccion');
  const inputTelefono = document.getElementById('input-telefono');
  const inputRepresentante = document.getElementById('input-representante');
  const inputSector = document.getElementById('input-sector');

  // Mostrar datos
  if (usuario) {
    userButton.textContent = `👤 ${usuario.nombre || 'Usuario'}`;
    empresaNombre.textContent = usuario.nombre || 'No registrado';
    empresaNit.textContent = usuario.nit || 'No registrado';
    empresaDireccionText.textContent = usuario.direccion || 'No registrado';
    empresaTelefonoText.textContent = usuario.telefono || 'No registrado';
    empresaEmail.textContent = usuario.correo || 'No registrado';
    empresaRepresentanteText.textContent = usuario.representante || 'No registrado';
    empresaSectorText.textContent = usuario.sector || 'No registrado';
    empresaFecha.textContent = usuario.fechaRegistro || 'No registrado';
  }

  // Abrir modal editar
  btnEditar.addEventListener('click', () => {
    if (!usuario) return alert('No hay usuario cargado');
    inputDireccion.value = usuario.direccion || '';
    inputTelefono.value = usuario.telefono || '';
    inputRepresentante.value = usuario.representante || '';
    inputSector.value = usuario.sector || '';
    modal.style.display = 'flex';
  });

  btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Guardar cambios
  formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!usuario) return;

    const datosActualizados = {
      direccion: inputDireccion.value.trim(),
      telefono: inputTelefono.value.trim(),
      representante: inputRepresentante.value.trim(),
      sector: inputSector.value.trim()
    };

    try {
      const response = await fetch(`/api/empresa/editar/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error actualizando datos');
      }

      // Actualizar vista y localStorage
      usuario.direccion = datosActualizados.direccion;
      usuario.telefono = datosActualizados.telefono;
      usuario.representante = datosActualizados.representante;
      usuario.sector = datosActualizados.sector;

      localStorage.setItem('usuario', JSON.stringify(usuario));

      empresaDireccionText.textContent = usuario.direccion;
      empresaTelefonoText.textContent = usuario.telefono;
      empresaRepresentanteText.textContent = usuario.representante;
      empresaSectorText.textContent = usuario.sector;

      modal.style.display = 'none';
      alert('Datos de empresa actualizados correctamente.');
    } catch (error) {
      alert('Error al actualizar datos: ' + error.message);
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
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
      const res = await fetch(`/api/empresa/cambiar-contrasena/${usuario.id}`, {
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
