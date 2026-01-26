
$(function () {
    iniciarInterfaz();
});

function iniciarInterfaz() {
    const card = (d) => `
    <div class="border rounded-3 p-3">
      <div class="d-flex align-items-start justify-content-between">
        <div>
          <strong>${d.nombre}</strong>
          <div class="mt-1">${DataList.badgeEstado(d.estado || 'desconocido')}</div>
          <div class="text-muted mt-2">
            <i class="bi bi-envelope me-2"></i>${d.email}
            <i class="bi bi-telephone ms-3 me-2"></i>${d.telefono}
          </div>
          <div class="mt-2">
            <span class="text-success">Rating: ${d.rating.toFixed(1)}/5.0</span>
            <span class="ms-3 text-muted">${DataList.fmtKm(d.kilometros)}</span>
            <span class="ms-3 text-muted">${d.viajes} viajes</span>
          </div>
        </div>
        <div class="text-muted"><i class="bi bi-chevron-down"></i></div>
      </div>
    </div>
  `;
    DataList.mount({
        container: '#drivers-list',
        endpoint: '/api/conductores',
        storageKey: 'conductores',
        pageSize: 5,
        renderItem: card
    });
}
