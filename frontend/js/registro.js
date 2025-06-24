function cambiarFormulario() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const camposPersonas = document.getElementById('camposPersonas');
    const camposEmpresas = document.getElementById('camposEmpresas');

    // Ocultar todos los campos dinámicos
    camposPersonas.classList.remove('mostrar');
    camposEmpresas.classList.remove('mostrar');

    // Mostrar campos según la selección
    if (tipoCliente === 'personas') {
        camposPersonas.classList.add('mostrar');
        // Quitar required de campos de empresa
        setRequiredFields('camposEmpresas', false);
        setRequiredFields('camposPersonas', true);
    } else if (tipoCliente === 'empresas') {
        camposEmpresas.classList.add('mostrar');
        // Quitar required de campos de persona
        setRequiredFields('camposPersonas', false);
        setRequiredFields('camposEmpresas', true);
    }
}

function setRequiredFields(containerId, isRequired) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input');
    
    inputs.forEach(input => {
        if (isRequired) {
            input.setAttribute('required', '');
        } else {
            input.removeAttribute('required');
        }
    });
}

// Función para sanitizar cadenas (prevenir XSS)
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[tag]));
}

// Validar que las contraseñas coincidan
function validarContrasenas() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPassword-error');
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Las contraseñas no coinciden';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// Validar longitud de contraseña
function validarLongitudContrasena() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('password-error');
    
    if (password.length < 8) {
        errorElement.textContent = 'La contraseña debe tener al menos 8 caracteres';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// Validar formato de NIT (ejemplo para Colombia: 123456789-0)
function validarNIT() {
    const nit = document.getElementById('nit').value;
    const errorElement = document.getElementById('nit-error');
    const regex = /^[0-9]{9}-[0-9]$/;
    
    if (nit && !regex.test(nit)) {
        errorElement.textContent = 'Formato de NIT inválido. Use: 123456789-0';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners para validación en tiempo real
    document.getElementById('password').addEventListener('blur', validarLongitudContrasena);
    document.getElementById('confirmPassword').addEventListener('blur', validarContrasenas);
    document.getElementById('nit').addEventListener('blur', validarNIT);
    
    // Delegación de eventos para campos dinámicos
    document.getElementById('registroForm').addEventListener('input', function(e) {
        if (e.target.id === 'password') validarLongitudContrasena();
        if (e.target.id === 'confirmPassword') validarContrasenas();
        if (e.target.id === 'nit') validarNIT();
    });
    
    // Manejar el envío del formulario
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar contraseñas y longitud
        const isPasswordValid = validarLongitudContrasena();
        const isConfirmValid = validarContrasenas();
        
        if (!isPasswordValid || !isConfirmValid) {
            return;
        }
        
        const tipoCliente = document.getElementById('tipoCliente').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (tipoCliente === 'personas') {
            const nombre = document.getElementById('nombreCompleto').value;
            
            // Sanitizar el nombre para la alerta
            const nombreSanitizado = escapeHtml(nombre);
            alert(`Registro exitoso para Persona:\nNombre: ${nombreSanitizado}\nEmail: ${email}`);
            
            // Aquí puedes enviar los datos al servidor
            console.log({
                tipo: 'personas',
                nombre: nombre,
                email: email,
                password: password
            });
            
        } else if (tipoCliente === 'empresas') {
            const razonSocial = document.getElementById('razonSocial').value;
            const nit = document.getElementById('nit').value;
            const representante = document.getElementById('representanteLegal').value;
            const direccion = document.getElementById('direccion').value;
            const telefono = document.getElementById('telefono').value;
            
            // Validar NIT si está presente
            if (!validarNIT()) {
                return;
            }
            
            // Sanitizar los datos para la alerta
            const razonSanitizada = escapeHtml(razonSocial);
            const nitSanitizado = escapeHtml(nit);
            const repSanitizado = escapeHtml(representante);
            const dirSanitizada = escapeHtml(direccion);
            
            alert(`Registro exitoso para Empresa:\nRazón Social: ${razonSanitizada}\nNIT: ${nitSanitizado}\nRepresentante: ${repSanitizado}\nDirección: ${dirSanitizada}\nEmail: ${email}`);
            
            // Aquí puedes enviar los datos al servidor
            console.log({
                tipo: 'empresas',
                razonSocial: razonSocial,
                nit: nit,
                representanteLegal: representante,
                direccion: direccion,
                telefono: telefono,
                email: email,
                password: password
            });
        }
    });
});