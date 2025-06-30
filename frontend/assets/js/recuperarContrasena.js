document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const emailInput = form.querySelector('input[type="email"]');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validarEmail(emailInput.value)) {
            alert('Por favor ingresa un correo electrónico válido.');
            emailInput.classList.add('error');
            return;
        }

        emailInput.classList.remove('error');

        alert(`Se ha enviado un enlace de recuperación a:\n${emailInput.value}`);
        form.reset();
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
