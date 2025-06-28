document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#documentos-table tbody');
  const buscarInput = document.getElementById('buscarDocumento');
  const filtroTipo = document.getElementById('filtroTipo');

  // Datos ficticios para mostrar
  let documentos = [
    {
      nombre: 'Contrato Acuerdo Comercial.pdf',
      tipo: 'contrato',
      fecha_subida: '2025-06-27',
      estado: 'Activo',
      url: '#'
    },
    {
      nombre: 'Informe Anual de Progreso.docx',
      tipo: 'informe',
      fecha_subida: '2025-05-15',
      estado: 'Pendiente',
      url: '#'
    },
    {
      nombre: 'Certificado Ambiental.pdf',
      tipo: 'certificado',
      fecha_subida: '2025-04-10',
      estado: 'Aprobado',
      url: '#'
    }
  ];

  function mostrarDocumentos(lista) {
    tbody.innerHTML = '';

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No hay documentos disponibles.</td></tr>`;
      return;
    }

    lista.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${doc.nombre || '-'}</td>
        <td>${doc.tipo || '-'}</td>
        <td>${doc.fecha_subida || '-'}</td>
        <td><span class="estado ${doc.estado.toLowerCase()}">${doc.estado}</span></td>
        <td><a href="${doc.url}" target="_blank" class="btn-ver">👁️ Ver</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function aplicarFiltros() {
    const texto = buscarInput.value.toLowerCase();
    const tipo = filtroTipo.value;

    const filtrados = documentos.filter(doc => {
      const coincideTexto = doc.nombre.toLowerCase().includes(texto);
      const coincideTipo = tipo ? doc.tipo === tipo : true;
      return coincideTexto && coincideTipo;
    });

    mostrarDocumentos(filtrados);
  }

  buscarInput.addEventListener('input', aplicarFiltros);
  filtroTipo.addEventListener('change', aplicarFiltros);

  // Mostrar datos ficticios al cargar
  mostrarDocumentos(documentos);
});

const botonVer = document.createElement('button');
botonVer.className = 'btn-ver';
botonVer.title = 'Ver documento';
botonVer.innerHTML = '📄<span>Ver</span>';
// Agrega evento o funcionalidad a botonVer si es necesario
