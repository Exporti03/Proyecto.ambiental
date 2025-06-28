document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#certificados-table tbody');
  const buscarInput = document.getElementById('buscarCertificado');
  const filtroEstado = document.getElementById('filtroEstado');

  // Datos ficticios de certificados
  let certificados = [
    {
      nombre: 'Certificado Ambiental Básico',
      estado: 'emitido',
      fecha_emision: '2024-12-01',
      fecha_expiracion: '2025-12-01',
      url: '#'
    },
    {
      nombre: 'Certificado de Cumplimiento',
      estado: 'pendiente',
      fecha_emision: '-',
      fecha_expiracion: '-',
      url: '#'
    },
    {
      nombre: 'Certificado de Seguridad',
      estado: 'rechazado',
      fecha_emision: '2024-11-15',
      fecha_expiracion: '2025-11-15',
      url: '#'
    }
  ];

  function mostrarCertificados(lista) {
    tbody.innerHTML = '';

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No hay certificados disponibles.</td></tr>`;
      return;
    }

    lista.forEach(cert => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cert.nombre || '-'}</td>
        <td><span class="estado ${cert.estado}">${cert.estado.charAt(0).toUpperCase() + cert.estado.slice(1)}</span></td>
        <td>${cert.fecha_emision || '-'}</td>
        <td>${cert.fecha_expiracion || '-'}</td>
        <td><a href="${cert.url}" target="_blank" class="btn-ver">👁️ Ver</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function aplicarFiltros() {
    const texto = buscarInput.value.toLowerCase();
    const estado = filtroEstado.value;

    const filtrados = certificados.filter(cert => {
      const coincideTexto = cert.nombre.toLowerCase().includes(texto);
      const coincideEstado = estado ? cert.estado === estado : true;
      return coincideTexto && coincideEstado;
    });

    mostrarCertificados(filtrados);
  }

  buscarInput.addEventListener('input', aplicarFiltros);
  filtroEstado.addEventListener('change', aplicarFiltros);

  // Mostrar al cargar
  mostrarCertificados(certificados);
});