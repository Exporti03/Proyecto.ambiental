document.addEventListener('DOMContentLoaded', function () {
    const tipoCliente = document.getElementById('tipoCliente');
    const camposPersonas = document.getElementById('camposPersonas');
    const camposEmpresas = document.getElementById('camposEmpresas');

    tipoCliente.addEventListener('change', cambiarFormulario);

    document.getElementById('password').addEventListener('blur', validarLongitudContrasena);
    document.getElementById('confirmPassword').addEventListener('blur', validarContrasenas);
    document.getElementById('nit').addEventListener('blur', validarNIT);

    document.getElementById('registroForm').addEventListener('input', function (e) {
        if (e.target.id === 'password') validarLongitudContrasena();
        if (e.target.id === 'confirmPassword') validarContrasenas();
        if (e.target.id === 'nit') validarNIT();
    });

    document.getElementById('registroForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const isPasswordValid = validarLongitudContrasena();
        const isConfirmValid = validarContrasenas();

        if (!isPasswordValid || !isConfirmValid) return;

        if (tipoCliente.value === 'personas') {
            const nombre = document.getElementById('nombreCompleto').value;
            alert(`Registro exitoso para Persona:\nNombre: ${escapeHtml(nombre)}\nEmail: ${document.getElementById('email').value}`);
        } else if (tipoCliente.value === 'empresas') {
            if (!validarNIT()) return;

            const razonSocial = escapeHtml(document.getElementById('razonSocial').value);
            const nit = escapeHtml(document.getElementById('nit').value);
            const representante = escapeHtml(document.getElementById('representanteLegal').value);
            const direccion = escapeHtml(document.getElementById('direccion').value);
            alert(`Registro exitoso para Empresa:\nRazón Social: ${razonSocial}\nNIT: ${nit}\nRepresentante: ${representante}\nDirección: ${direccion}`);
        }

        this.reset();
        ocultarCamposDinamicos();
    });

    function cambiarFormulario() {
        const valor = tipoCliente.value;
        ocultarCamposDinamicos();
        if (valor === 'personas') {
            camposPersonas.classList.add('mostrar');
            setRequiredFields(camposPersonas, true);
            setRequiredFields(camposEmpresas, false);
        } else if (valor === 'empresas') {
            camposEmpresas.classList.add('mostrar');
            setRequiredFields(camposPersonas, false);
            setRequiredFields(camposEmpresas, true);
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

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[tag]));
    }
});
