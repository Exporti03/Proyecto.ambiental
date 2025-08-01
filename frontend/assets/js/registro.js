document.addEventListener('DOMContentLoaded', function () { 
  const tipoCliente = document.getElementById('tipoCliente');
  const camposPersonas = document.getElementById('camposPersonas');
  const camposEmpresas = document.getElementById('camposEmpresas');

  // Mostrar/ocultar campos según tipo al cambiar selector
  tipoCliente.addEventListener('change', cambiarFormulario);

  document.getElementById('password').addEventListener('blur', validarLongitudContrasena);
  document.getElementById('confirmPassword').addEventListener('blur', validarContrasenas);
  document.getElementById('nit').addEventListener('blur', validarNIT);

  document.getElementById('registroForm').addEventListener('input', function (e) {
    if (e.target.id === 'password') validarLongitudContrasena();
    if (e.target.id === 'confirmPassword') validarContrasenas();
    if (e.target.id === 'nit') validarNIT();
  });

  // Envío del formulario
  document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const isPasswordValid = validarLongitudContrasena();
    const isConfirmValid = validarContrasenas();
    const tipo = tipoCliente.value;

    if (!isPasswordValid || !isConfirmValid) return;
    if (tipo === 'empresa' && !validarNIT()) return;

    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;

    const data = { tipo, correo, contrasena };

    if (tipo === 'personal') {
      data.nombreCompleto = document.getElementById('nombreCompleto').value;
    } else if (tipo === 'empresa') {
      data.razonSocial = document.getElementById('razonSocial').value;
      data.nit = document.getElementById('nit').value;
      data.representanteLegal = document.getElementById('representanteLegal').value;
      data.direccion = document.getElementById('direccion').value;
      data.telefono = document.getElementById('telefono').value;
    }

    try {
      const response = await fetch('http://localhost:3000/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Registro exitoso');
        this.reset();
        ocultarCamposDinamicos();

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        alert('❌ Error: ' + (result.error || 'No se pudo registrar'));
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('❌ Error de red al registrar');
    }
  });

  // Funciones auxiliares
  function cambiarFormulario() {
    const valor = tipoCliente.value;
    ocultarCamposDinamicos();
    if (valor === 'personal') {
      camposPersonas.classList.add('mostrar');
      setRequiredFields(camposPersonas, true);
      setRequiredFields(camposEmpresas, false);
    } else if (valor === 'empresa') {
      camposEmpresas.classList.add('mostrar');
      setRequiredFields(camposEmpresas, true);
      setRequiredFields(camposPersonas, false);
    }
  }

  function ocultarCamposDinamicos() {
    camposPersonas.classList.remove('mostrar');
    camposEmpresas.classList.remove('mostrar');
  }

  function setRequiredFields(container, required) {
    container.querySelectorAll('input').forEach(input => {
      if (required) input.setAttribute('required', '');
      else input.removeAttribute('required');
    });
  }

  function validarLongitudContrasena() {
    const password = document.getElementById('password');
    const error = document.getElementById('password-error');
    if (password.value.length < 8) {
      error.textContent = 'La contraseña debe tener al menos 8 caracteres';
      password.classList.add('error');
      return false;
    } else {
      error.textContent = '';
      password.classList.remove('error');
      return true;
    }
  }

  function validarContrasenas() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword');
    const error = document.getElementById('confirmPassword-error');
    if (password !== confirmPassword.value) {
      error.textContent = 'Las contraseñas no coinciden';
      confirmPassword.classList.add('error');
      return false;
    } else {
      error.textContent = '';
      confirmPassword.classList.remove('error');
      return true;
    }
  }

  function validarNIT() {
    const nit = document.getElementById('nit');
    const error = document.getElementById('nit-error');
    const regex = /^[0-9]{9}-[0-9]$/;
    if (nit.value && !regex.test(nit.value)) {
      error.textContent = 'Formato de NIT inválido. Use: 123456789-0';
      nit.classList.add('error');
      return false;
    } else {
      error.textContent = '';
      nit.classList.remove('error');
      return true;
    }
  }
});
