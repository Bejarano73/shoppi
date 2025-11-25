$(function () {
    const $table = $('#peticiones-table');
    const $total = $('#pt-total');
    const $mirando = $('#pt-mirando');

    function loadSummary() {
        $.getJSON('/shoppi/peticiones').done(function (resp) {
            if (resp && resp.estado === true && resp.salida) {
                $total.text(resp.salida.total || 0);
                $mirando.text(resp.salida.mirando || 0);
            }
        });
    }

    const dt = $table.DataTable({
        ajax: {
            url: '/shoppi/peticiones',
            dataSrc: function (json) {
                if (json && json.estado === true && json.salida && Array.isArray(json.salida.items))
                    return json.salida.items;
                return [];
            }
        },
        columns: [
            {data: 'id'},
            {data: 'origen'},
            {data: 'destino'},
            {data: 'fecha'},
            {data: 'hora'},
            {data: 'kilos'},
            {data: 'carga'},
            {data: 'tipoVehiculo'},
            {data: 'distancia'},
            {data: 'duracion'},
            {data: 'km'},
            {data: 'estado', render: function (v) {
                    const map = {'sin_asignacion': 'secondary', 'mirando_peticion': 'warning', 'asignando': 'info', 'asignada': 'success'};
                    const cls = map[String(v || '').toLowerCase()] || 'secondary';
                    return '<span class="badge bg-' + cls + '">' + (v || 'sin_asignacion') + '</span>';
                }},
            {data: null, orderable: false, render: function (row) {
                    return '<div class="btn-group btn-group-sm" role="group">'
                            + '<button class="btn btn-outline-primary pt-edit" data-id="' + row.id + '">Editar</button>'
                            + '<button class="btn btn-outline-danger pt-del" data-id="' + row.id + '">Eliminar</button>'
                            + '</div>';
                }}
        ],
        order: [[0, 'desc']],
        lengthChange: true,
        pageLength: 10,
        searching: true
    });

    dt.on('xhr', loadSummary);
    loadSummary();

    // Crear
    $('#pt-crear').on('click', function () {
        const body = [
            '<div class="row g-3">',
            '<div class="col-md-6"><label class="form-label">Origen *</label><input type="text" class="form-control" id="pt-origen"></div>',
            '<div class="col-md-6"><label class="form-label">Destino *</label><input type="text" class="form-control" id="pt-destino"></div>',
            '<div class="col-md-4"><label class="form-label">Fecha *</label><input type="text" class="form-control" id="pt-fecha" data-date></div>',
            '<div class="col-md-4"><label class="form-label">Hora *</label><input type="text" class="form-control" id="pt-hora" data-time></div>',
            '<div class="col-md-4"><label class="form-label">Kilos</label><input type="number" class="form-control" id="pt-kilos"></div>',
            '<div class="col-md-6"><label class="form-label">Carga</label><input type="text" class="form-control" id="pt-carga"></div>',
            '<div class="col-md-6"><label class="form-label">Tipo de Vehículo</label><select class="form-select" id="pt-tipo"><option value="sencillo">Camión Sencillo</option><option value="doble-troque">Camión Doble Troque</option><option value="tractomula">Tractomula</option><option value="plancha">Plancha</option><option value="refrigerado">Refrigerado</option><option value="volqueta">Volqueta</option></select></div>',
            '</div>'
        ].join('');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>'
                + '<button class="btn btn-success" id="pt-save">Crear</button>';
        app.modal.show({title: 'Crear Solicitud', body: body, footer: footer, size: 'lg', centered: true, scrollable: true});
        $(document).off('click', '#pt-save').on('click', '#pt-save', function () {
            const payload = {
                origen: $('#pt-origen').val().trim(),
                destino: $('#pt-destino').val().trim(),
                fecha: $('#pt-fecha').val(),
                hora: $('#pt-hora').val(),
                kilos: $('#pt-kilos').val(),
                carga: $('#pt-carga').val(),
                tipoVehiculo: $('#pt-tipo').val(),
                estado: 'sin_asignacion'
            };
            $.ajax({type: 'POST', url: '/shoppi/obtener', dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload)})
                    .done(function (resp) {
                        app.modal.hide();
                        dt.ajax.reload(null, false);
                        loadSummary();
                    })
                    .fail(function () {
                        alert('Error creando solicitud');
                    });
        });
    });

    // Editar
    $table.on('click', '.pt-edit', function () {
        const id = $(this).data('id');
        const row = dt.rows().data().toArray().find(r => r.id === id);
        if (!row)
            return;
        const body = [
            '<div class="row g-3">',
            '<div class="col-md-6"><label class="form-label">Origen *</label><input type="text" class="form-control" id="pt-origen" value="' + (row.origen || '') + '"></div>',
            '<div class="col-md-6"><label class="form-label">Destino *</label><input type="text" class="form-control" id="pt-destino" value="' + (row.destino || '') + '"></div>',
            '<div class="col-md-4"><label class="form-label">Fecha *</label><input type="text" class="form-control" id="pt-fecha" data-date value="' + (row.fecha || '') + '"></div>',
            '<div class="col-md-4"><label class="form-label">Hora *</label><input type="text" class="form-control" id="pt-hora" data-time value="' + (row.hora || '') + '"></div>',
            '<div class="col-md-4"><label class="form-label">Kilos</label><input type="number" class="form-control" id="pt-kilos" value="' + (row.kilos || '') + '"></div>',
            '<div class="col-md-6"><label class="form-label">Carga</label><input type="text" class="form-control" id="pt-carga" value="' + (row.carga || '') + '"></div>',
            '<div class="col-md-6"><label class="form-label">Tipo de Vehículo</label><select class="form-select" id="pt-tipo"><option ' + (row.tipoVehiculo === 'sencillo' ? 'selected' : '') + ' value="sencillo">Camión Sencillo</option><option ' + (row.tipoVehiculo === 'doble-troque' ? 'selected' : '') + ' value="doble-troque">Camión Doble Troque</option><option ' + (row.tipoVehiculo === 'tractomula' ? 'selected' : '') + ' value="tractomula">Tractomula</option><option ' + (row.tipoVehiculo === 'plancha' ? 'selected' : '') + ' value="plancha">Plancha</option><option ' + (row.tipoVehiculo === 'refrigerado' ? 'selected' : '') + ' value="refrigerado">Refrigerado</option><option ' + (row.tipoVehiculo === 'volqueta' ? 'selected' : '') + ' value="volqueta">Volqueta</option></select></div>',
            '<div class="col-md-6"><label class="form-label">Estado</label><select class="form-select" id="pt-estado">'
                    + '<option ' + (row.estado === 'sin_asignacion' ? 'selected' : '') + ' value="sin_asignacion">Sin asignación</option>'
                    + '<option ' + (row.estado === 'mirando_peticion' ? 'selected' : '') + ' value="mirando_peticion">Mirando petición</option>'
                    + '<option ' + (row.estado === 'asignando' ? 'selected' : '') + ' value="asignando">Asignando</option>'
                    + '<option ' + (row.estado === 'asignada' ? 'selected' : '') + ' value="asignada">Asignada</option>'
                    + '</select></div>',
            '</div>'
        ].join('');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>'
                + '<button class="btn btn-primary" id="pt-update">Guardar</button>';
        app.modal.show({title: 'Editar Solicitud ' + id, body: body, footer: footer, size: 'lg', centered: true, scrollable: true});
        $(document).off('click', '#pt-update').on('click', '#pt-update', function () {
            const payload = {
                origen: $('#pt-origen').val().trim(),
                destino: $('#pt-destino').val().trim(),
                fecha: $('#pt-fecha').val(),
                hora: $('#pt-hora').val(),
                kilos: $('#pt-kilos').val(),
                carga: $('#pt-carga').val(),
                tipoVehiculo: $('#pt-tipo').val(),
                estado: $('#pt-estado').val()
            };
            $.ajax({type: 'PUT', url: '/shoppi/peticiones/' + id, dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload)})
                    .done(function (resp) {
                        app.modal.hide();
                        dt.ajax.reload(null, false);
                        loadSummary();
                    })
                    .fail(function () {
                        alert('Error actualizando solicitud');
                    });
        });
    });

    // Eliminar
    $table.on('click', '.pt-del', function () {
        const id = $(this).data('id');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>'
                + '<button class="btn btn-danger" id="pt-confirm-del">Eliminar</button>';
        app.modal.show({title: 'Eliminar Solicitud ' + id, body: '<div class="text-muted">¿Confirmas eliminar esta solicitud?</div>', footer: footer, centered: true});
        $(document).off('click', '#pt-confirm-del').on('click', '#pt-confirm-del', function () {
            $.ajax({type: 'DELETE', url: '/shoppi/peticiones/' + id, dataType: 'json'})
                    .done(function () {
                        app.modal.hide();
                        dt.ajax.reload(null, false);
                        loadSummary();
                    })
                    .fail(function () {
                        alert('Error eliminando solicitud');
                    });
        });
    });
});

