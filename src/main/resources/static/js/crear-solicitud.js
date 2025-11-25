window.__cs = window.__cs || {eventsBound: false, mapReady: false};
window.initMap = function () {
    window.__cs.mapReady = true;
};
(function () {
    window.gm_authFailure = function () {
        const elMapa = document.getElementById('cs-map');
        if (elMapa) {
            elMapa.innerHTML = '<div class="text-danger small">No se pudo cargar Google Maps. Usando cálculo de ruta del servidor.</div>';
        }
    };
})();

(function () {
    const run = () => {
        window.iniciarInterfazCrearSolicitud = iniciarInterfazCrearSolicitud;
        iniciarInterfazCrearSolicitud();
        if (typeof window.iniciarInterfaz === 'function')
            window.iniciarInterfaz();
    };
    if (document.readyState !== 'loading')
        run();
    else
        document.addEventListener('DOMContentLoaded', run);
})();
function iniciarInterfazCrearSolicitud() {
    const hasPage = document.getElementById('cs-origen') || document.getElementById('cs-peticiones-table') || document.getElementById('cs-map');
    if (!hasPage)
        return;
    try {
        app.spinner(true, 'Cargando interfaz...');
    } catch {
    }
    const elOrigen = document.getElementById('cs-origen');
    const elDestino = document.getElementById('cs-destino');
    const elDist = document.getElementById('cs-dist');
    const elDur = document.getElementById('cs-dur');
    const elKm = document.getElementById('cs-km');
    const elOut = document.getElementById('cs-out');
    const elArr = document.getElementById('cs-arr');
    const elTolls = document.getElementById('cs-tolls');
    const elMapa = document.getElementById('cs-map');
    const btnCrear = document.getElementById('cs-crear');
    const idLabel = document.getElementById('cs-id');
    const resultado = document.getElementById('cs-result');

    const hasGoogle = typeof window.google !== 'undefined' && !!google.maps && typeof google.maps.Map === 'function';
    let map, directionsService, directionsRenderer;

    if (hasGoogle && elMapa) {
        map = new google.maps.Map(elMapa, {center: {lat: 7.1193, lng: -73.1227}, zoom: 7});
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        try {
            // Evitar Autocomplete legacy en proyectos nuevos
        } catch {
        }
    }

    const calcularRuta = () => {
        const origenVal = (elOrigen?.value || '').trim();
        const destinoVal = (elDestino?.value || '').trim();
        if (!origenVal || !destinoVal) {
            if (elDist)
                elDist.textContent = '—';
            if (elDur)
                elDur.textContent = '—';
            return;
        }
        const gmReady = typeof window.google !== 'undefined' && !!google.maps && typeof google.maps.Map === 'function';
        if (gmReady && !directionsService && elMapa) {
            map = new google.maps.Map(elMapa, {center: {lat: 7.1193, lng: -73.1227}, zoom: 7});
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
        }
        if (!directionsService) {
            const url = '/shoppi/ruta?origen=' + encodeURIComponent(origenVal) + '&destino=' + encodeURIComponent(destinoVal);
            const onOk = (data) => {
                if (elDist)
                    elDist.textContent = data.distancia || '—';
                if (elDur)
                    elDur.textContent = data.duracion || '—';
                if (elKm) {
                    const m = String(data.distancia || '').match(/[\d,.]+/);
                    elKm.textContent = m ? m[0] + ' km' : '—';
                }
            };
            if (window.jQuery) {
                jQuery.getJSON(url).done(function (resp) {
                    if (resp && resp.estado === true && resp.salida)
                        onOk(resp.salida);
                }).fail(function () {
                    if (elDist)
                        elDist.textContent = '—';
                    if (elDur)
                        elDur.textContent = '—';
                });
            } else {
                fetch(url).then(r => r.ok ? r.json() : Promise.reject(r)).then(resp => {
                    if (resp && resp.estado === true && resp.salida)
                        onOk(resp.salida);
                }).catch(() => {
                    if (elDist)
                        elDist.textContent = '—';
                    if (elDur)
                        elDur.textContent = '—';
                });
            }
            return;
        }
        directionsService.route({
            origin: origenVal,
            destination: destinoVal,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {departureTime: new Date(), trafficModel: google.maps.TrafficModel.PESSIMISTIC}
        }, (res, status) => {
            if (status === 'OK') {
                const leg = res.routes[0].legs[0];
                if (elDist)
                    elDist.textContent = leg.distance.text;
                if (elDur)
                    elDur.textContent = leg.duration.text;
                if (elKm)
                    elKm.textContent = (leg.distance.value / 1000).toFixed(1) + ' km';
                const fechaVal = document.getElementById('cs-fecha')?.value || '';
                const horaVal = document.getElementById('cs-hora')?.value || '00:00';
                let dep = new Date();
                if (fechaVal) {
                    const [d, m, y] = fechaVal.split('/');
                    const [hh, mm] = horaVal.split(':');
                    dep = new Date(+y, +m - 1, +d, +hh, +mm);
                }
                const arr = new Date(dep.getTime() + leg.duration.value * 1000);
                const fmt = dt => dt.toLocaleString();
                if (elOut)
                    elOut.textContent = fmt(dep);
                if (elArr)
                    elArr.textContent = fmt(arr);
                let peajes = 0;
                leg.steps.forEach(step => {
                    if ((step.instructions || '').toLowerCase().includes('toll'))
                        peajes++;
                });
                if (elTolls)
                    elTolls.textContent = String(peajes);
                directionsRenderer && directionsRenderer.setDirections(res);
            } else {
                if (elDist)
                    elDist.textContent = '—';
                if (elDur)
                    elDur.textContent = '—';
            }
        });
    };

    const fechaEl = document.getElementById('cs-fecha');
    const horaEl = document.getElementById('cs-hora');
    if (window.jQuery) {
        jQuery(document).on('change', '#cs-origen,#cs-destino,#cs-fecha,#cs-hora', calcularRuta);
    } else {
        elOrigen && elOrigen.addEventListener('change', calcularRuta);
        elDestino && elDestino.addEventListener('change', calcularRuta);
        fechaEl && fechaEl.addEventListener('change', calcularRuta);
        horaEl && horaEl.addEventListener('change', calcularRuta);
    }

    const $table = $('#cs-peticiones-table');
    let dt = null;
    function loadSummary() {
        if (!window.jQuery)
            return;
        $.getJSON('/shoppi/peticiones').done(function (resp) {
            if (resp && resp.estado === true && resp.salida) {
                $('#cs-total').text(resp.salida.total || 0);
                $('#cs-mirando').text(resp.salida.mirando || 0);
            }
        });
    }
    function ensureDataTables() {
        return new Promise((resolve) => {
            if (window.jQuery && jQuery.fn && typeof jQuery.fn.DataTable === 'function')
                return resolve(true);
            const addScript = (src) => new Promise((ok) => {
                    const s = document.createElement('script');
                    s.src = src;
                    s.onload = () => ok(true);
                    s.onerror = () => ok(false);
                    document.body.appendChild(s);
                });
            const chain = async () => {
                if (!window.jQuery) {
                    const s = document.createElement('script');
                    s.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
                    s.onload = () => {
                    };
                    document.body.appendChild(s);
                }
                await addScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js');
                await addScript('https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js');
                resolve(window.jQuery && jQuery.fn && typeof jQuery.fn.DataTable === 'function');
            };
            chain();
        });
    }
    async function initList() {
        if (!$table.length) {
            try {
                app.spinner(false);
            } catch {
            }
            ;
            return;
        }
        const ok = await ensureDataTables();
        if (ok) {
            if ($.fn.dataTable && $.fn.dataTable.isDataTable('#cs-peticiones-table')) {
                dt = $('#cs-peticiones-table').DataTable();
                dt.off('xhr', loadSummary);
                dt.on('xhr', loadSummary);
                loadSummary();
                return;
            }
            // limpiar wrappers duplicados si existieran
            const wrapId = 'cs-peticiones-table_wrapper';
            const wrappers = document.querySelectorAll('#' + wrapId);
            if (wrappers.length > 1) {
                wrappers.forEach((w, i) => {
                    if (i < wrappers.length - 1)
                        w.remove();
                });
            }
            dt = $table.DataTable({
                ajax: {url: '/shoppi/peticiones', dataSrc: function (json) {
                        if (json && json.estado === true && json.salida && Array.isArray(json.salida.items))
                            return json.salida.items;
                        return [];
                    }},
                columns: [
                    {data: 'id'}, {data: 'origen'}, {data: 'destino'}, {data: 'fecha'}, {data: 'hora'}, {data: 'kilos'}, {data: 'carga'}, {data: 'tipoVehiculo'}, {data: 'distancia'}, {data: 'duracion'}, {data: 'km'},
                    {data: 'watchersCount', render: function (v) {
                            v = Number(v || 0);
                            var dot = '<span class="d-inline-block rounded-circle me-1" style="width:10px;height:10px;background:#0d6efd"></span>';
                            var count = v > 1 ? '<span class="badge bg-primary">' + v + '</span>' : '';
                            return dot + count;
                        }},
                    {data: 'estado', render: function (v) {
                            const map = {'sin_asignacion': 'secondary', 'mirando_peticion': 'warning', 'asignando': 'info', 'asignada': 'success'};
                            const cls = map[String(v || '').toLowerCase()] || 'secondary';
                            return '<span class="badge bg-' + cls + '">' + (v || 'sin_asignacion') + '</span>';
                        }},
                    {data: null, orderable: false, render: function (row) {
                            return '<div class="btn-group btn-group-sm" role="group">' +
                                    '<button class="btn btn-outline-primary cs-edit" data-id="' + row.id + '">Editar</button>' +
                                    '<button class="btn btn-outline-danger cs-del" data-id="' + row.id + '">Eliminar</button>' +
                                    '</div>';
                        }}
                ], order: [[0, 'desc']], pageLength: 10, retrieve: true, dom: 'rtip', scrollX: true
            });
            dt.on('xhr', function () {
                try {
                    app.spinner(false);
                } catch {
                }
                loadSummary();
            });
            dt.on('init.dt', function () {
                try {
                    app.spinner(false);
                } catch {
                }
            });
            loadSummary();

            // filtros personalizados
            const txtEl = document.getElementById('cs-filter-text');
            const estEl = document.getElementById('cs-filter-estado');
            const watchEl = document.getElementById('cs-filter-watch');
            if (txtEl)
                txtEl.addEventListener('input', function () {
                    dt.search(this.value || '').draw();
                });
            if (estEl) {
                const getEstadoValue = () => {
                    const v = estEl.value || '';
                    if (v)
                        return v;
                    const sel = estEl.querySelector('mwc-list-item[selected]');
                    return sel ? sel.getAttribute('value') || '' : '';
                };
                const applyEstado = () => {
                    const v = getEstadoValue();
                    dt.column(12).search(v ? '^' + v + '$' : '', true, false).draw();
                };
                estEl.addEventListener('change', applyEstado);
                estEl.addEventListener('selected', applyEstado);
            }
            if (watchEl) {
                if (!window.__csWatchFilterAdded) {
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex, rowData) {
                        const min = Number((watchEl.value || '0') || 0);
                        const wc = Number(rowData.watchersCount || 0);
                        return wc >= min;
                    });
                    window.__csWatchFilterAdded = true;
                }
                watchEl.addEventListener('input', function () {
                    dt.draw();
                });
            }
        } else {
            // Fallback plano si DataTables no carga
            fetch('/shoppi/peticiones').then(r => r.ok ? r.json() : Promise.reject(r)).then(resp => {
                const items = (resp && resp.estado === true && resp.salida && Array.isArray(resp.salida.items)) ? resp.salida.items : [];
                const tbody = document.createElement('tbody');
                items.forEach(row => {
                    const tr = document.createElement('tr');
                    const cells = [row.id, row.origen, row.destino, row.fecha, row.hora, row.kilos, row.carga, row.tipoVehiculo, row.distancia, row.duracion, row.km,
                        (function (v) {
                            v = Number(v || 0);
                            const dot = '<span class="d-inline-block rounded-circle me-1" style="width:10px;height:10px;background:#0d6efd"></span>';
                            const count = v > 1 ? ('<span class="badge bg-primary">' + v + '</span>') : '';
                            return dot + count;
                        })(row.watchersCount),
                        (function (v) {
                            const map = {'sin_asignacion': 'secondary', 'mirando_peticion': 'warning', 'asignando': 'info', 'asignada': 'success'};
                            const cls = map[String(v || '').toLowerCase()] || 'secondary';
                            return '<span class="badge bg-' + cls + '">' + (v || 'sin_asignacion') + '</span>';
                        })(row.estado),
                        '<div class="btn-group btn-group-sm" role="group"><button class="btn btn-outline-primary cs-edit" data-id="' + row.id + '">Editar</button><button class="btn btn-outline-danger cs-del" data-id="' + row.id + '">Eliminar</button></div>'
                    ];
                    cells.forEach(html => {
                        const td = document.createElement('td');
                        td.innerHTML = html;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                const tableEl = document.getElementById('cs-peticiones-table');
                if (tableEl) {
                    const oldTbody = tableEl.querySelector('tbody');
                    if (oldTbody)
                        oldTbody.remove();
                    tableEl.appendChild(tbody);
                }
                loadSummary();
                try {
                    app.spinner(false);
                } catch {
                }
            }).catch(() => {
            });
        }
    }
    initList();
    setTimeout(function () {
        try {
            app.spinner(false);
        } catch {
        }
    }, 1200);

    let _createLock = false;
    function openCreateModal() {
        if (_createLock)
            return;
        const modalEl = document.getElementById('appModal');
        if (modalEl && modalEl.classList.contains('show'))
            return;
        _createLock = true;
        setTimeout(() => {
            _createLock = false;
        }, 500);
        const body = [
            '<div class="row g-3">',
            '<div class="col-md-6"><mwc-textfield label="Origen *" id="pt-origen" placeholder="Ciudad / Dirección"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-textfield label="Destino *" id="pt-destino" placeholder="Ciudad / Dirección"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield label="Fecha *" id="pt-fecha" placeholder="dd/mm/aaaa"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield label="Hora *" id="pt-hora" placeholder="--:--"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield type="number" label="Kilos" id="pt-kilos" placeholder="Ej: 5000"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-textfield label="Carga" id="pt-carga" placeholder="Ej: Materiales de construcción"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-select label="Tipo de Vehículo" id="pt-tipo">'
                    + '<mwc-list-item value="sencillo">Camión Sencillo</mwc-list-item>'
                    + '<mwc-list-item value="doble-troque">Camión Doble Troque</mwc-list-item>'
                    + '<mwc-list-item value="tractomula">Tractomula</mwc-list-item>'
                    + '<mwc-list-item value="plancha">Plancha</mwc-list-item>'
                    + '<mwc-list-item value="refrigerado">Refrigerado</mwc-list-item>'
                    + '<mwc-list-item value="volqueta">Volqueta</mwc-list-item>'
                    + '</mwc-select></div>',
            '<div class="col-12">',
            '<div class="row g-3">',
            '<div class="col-12 col-md-6">',
            '<div class="calc-box p-3">',
            '<div class="d-flex align-items-center justify-content-between"><div class="text-muted">Distancia</div><div id="pt-dist" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Duración</div><div id="pt-dur" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Kilómetros</div><div id="pt-km" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Salida</div><div id="pt-out" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Llegada Estimada</div><div id="pt-arr" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Peajes (estimado)</div><div id="pt-tolls" class="fw-semibold">—</div></div>',
            '</div>',
            '</div>',
            '<div class="col-12 col-md-6">',
            '<div id="pt-map" class="map-box"></div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>' +
                '<button class="btn btn-success" id="pt-save">Crear</button>';
        app.modal.show({title: 'Crear Solicitud', body: body, footer: footer, size: 'lg', centered: true, scrollable: true});
        bindModalRouting();
    }
    if (window.jQuery) {
        $(document).off('click.cs_create').on('click.cs_create', '#cs-crear', openCreateModal);
    } else {
        if (window.__cs && window.__cs.createHandler) {
            document.removeEventListener('click', window.__cs.createHandler);
        }
        window.__cs = window.__cs || {};
        window.__cs.createHandler = function (e) {
            if (e.target && e.target.closest('#cs-crear'))
                openCreateModal();
        };
        document.addEventListener('click', window.__cs.createHandler);
    }
    $(document).on('click', '#pt-save', function () {
        const payload = {
            origen: (document.getElementById('pt-origen')?.value || '').trim(),
            destino: (document.getElementById('pt-destino')?.value || '').trim(),
            fecha: document.getElementById('pt-fecha')?.value || '',
            hora: document.getElementById('pt-hora')?.value || '',
            kilos: document.getElementById('pt-kilos')?.value || '',
            carga: document.getElementById('pt-carga')?.value || '',
            tipoVehiculo: document.getElementById('pt-tipo')?.value || '',
            estado: 'sin_asignacion'
        };
        app.guardando(true, 1200);
        $.ajax({type: 'POST', url: '/shoppi/obtener', dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload)})
                .done(function (resp) {
                    app.modal.hide();
                    if (dt)
                        dt.ajax.reload(null, false);
                    loadSummary();
                    app.guardando(false);
                })
                .fail(function () {
                    alert('Error creando solicitud');
                });
    });

    $(document).on('click', '.cs-edit', function () {
        const id = $(this).data('id');
        const row = dt ? dt.rows().data().toArray().find(r => r.id === id) : null;
        if (!row)
            return;
        const body = [
            '<div class="row g-3">',
            '<div class="col-md-6"><mwc-textfield label="Origen *" id="pt-origen" value="' + (row.origen || '') + '"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-textfield label="Destino *" id="pt-destino" value="' + (row.destino || '') + '"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield label="Fecha *" id="pt-fecha" value="' + (row.fecha || '') + '"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield label="Hora *" id="pt-hora" value="' + (row.hora || '') + '"></mwc-textfield></div>',
            '<div class="col-md-4"><mwc-textfield type="number" label="Kilos" id="pt-kilos" value="' + (row.kilos || '') + '"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-textfield label="Carga" id="pt-carga" value="' + (row.carga || '') + '"></mwc-textfield></div>',
            '<div class="col-md-6"><mwc-select label="Tipo de Vehículo" id="pt-tipo">'
                    + '<mwc-list-item value="sencillo" ' + (row.tipoVehiculo === 'sencillo' ? 'selected' : '') + '>Camión Sencillo</mwc-list-item>'
                    + '<mwc-list-item value="doble-troque" ' + (row.tipoVehiculo === 'doble-troque' ? 'selected' : '') + '>Camión Doble Troque</mwc-list-item>'
                    + '<mwc-list-item value="tractomula" ' + (row.tipoVehiculo === 'tractomula' ? 'selected' : '') + '>Tractomula</mwc-list-item>'
                    + '<mwc-list-item value="plancha" ' + (row.tipoVehiculo === 'plancha' ? 'selected' : '') + '>Plancha</mwc-list-item>'
                    + '<mwc-list-item value="refrigerado" ' + (row.tipoVehiculo === 'refrigerado' ? 'selected' : '') + '>Refrigerado</mwc-list-item>'
                    + '<mwc-list-item value="volqueta" ' + (row.tipoVehiculo === 'volqueta' ? 'selected' : '') + '>Volqueta</mwc-list-item>'
                    + '</mwc-select></div>',
            '<div class="col-md-6"><mwc-select label="Estado" id="pt-estado">'
                    + '<mwc-list-item value="sin_asignacion" ' + (row.estado === 'sin_asignacion' ? 'selected' : '') + '>Sin asignación</mwc-list-item>'
                    + '<mwc-list-item value="mirando_peticion" ' + (row.estado === 'mirando_peticion' ? 'selected' : '') + '>Mirando petición</mwc-list-item>'
                    + '<mwc-list-item value="asignando" ' + (row.estado === 'asignando' ? 'selected' : '') + '>Asignando</mwc-list-item>'
                    + '<mwc-list-item value="asignada" ' + (row.estado === 'asignada' ? 'selected' : '') + '>Asignada</mwc-list-item>'
                    + '</mwc-select></div>',
            '<div class="col-12">',
            '<div class="row g-3">',
            '<div class="col-12 col-md-6">',
            '<div class="calc-box p-3">',
            '<div class="d-flex align-items-center justify-content-between"><div class="text-muted">Distancia</div><div id="pt-dist" class="fw-semibold">' + (row.distancia || '—') + '</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Duración</div><div id="pt-dur" class="fw-semibold">' + (row.duracion || '—') + '</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Kilómetros</div><div id="pt-km" class="fw-semibold">' + (row.km || '—') + '</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Salida</div><div id="pt-out" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Llegada Estimada</div><div id="pt-arr" class="fw-semibold">—</div></div>',
            '<div class="d-flex align-items-center justify-content-between mt-2"><div class="text-muted">Peajes (estimado)</div><div id="pt-tolls" class="fw-semibold">—</div></div>',
            '</div>',
            '</div>',
            '<div class="col-12 col-md-6">',
            '<div id="pt-map" class="map-box"></div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>' +
                '<button class="btn btn-primary" id="pt-update" data-id="' + id + '">Guardar</button>';
        app.modal.show({title: 'Editar Solicitud ' + id, body: body, footer: footer, size: 'lg', centered: true, scrollable: true});
        bindModalRouting();
    });
    $(document).on('click', '#pt-update', function () {
        const id = $(this).data('id');
        const payload = {
            origen: (document.getElementById('pt-origen')?.value || '').trim(),
            destino: (document.getElementById('pt-destino')?.value || '').trim(),
            fecha: document.getElementById('pt-fecha')?.value || '',
            hora: document.getElementById('pt-hora')?.value || '',
            kilos: document.getElementById('pt-kilos')?.value || '',
            carga: document.getElementById('pt-carga')?.value || '',
            tipoVehiculo: document.getElementById('pt-tipo')?.value || '',
            estado: document.getElementById('pt-estado')?.value || ''
        };
        $.ajax({type: 'PUT', url: '/shoppi/peticiones/' + id, dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload)})
                .done(function (resp) {
                    app.modal.hide();
                    if (dt)
                        dt.ajax.reload(null, false);
                    loadSummary();
                })
                .fail(function () {
                    alert('Error actualizando solicitud');
                });
    });

    function bindModalRouting() {
        const hasGoogle = typeof window.google !== 'undefined' && !!google.maps && typeof google.maps.Map === 'function';
        let map = null, ds = null, dr = null;
        const elMap = document.getElementById('pt-map');
        if (hasGoogle && elMap) {
            map = new google.maps.Map(elMap, {center: {lat: 7.1193, lng: -73.1227}, zoom: 7});
            ds = new google.maps.DirectionsService();
            dr = new google.maps.DirectionsRenderer();
            dr.setMap(map);
        }
        const calc = function () {
            const o = (document.getElementById('pt-origen')?.value || '').trim();
            const d = (document.getElementById('pt-destino')?.value || '').trim();
            if (!o || !d)
                return;
            if (ds) {
                ds.route({origin: o, destination: d, travelMode: google.maps.TravelMode.DRIVING}, function (res, status) {
                    if (status === 'OK') {
                        const leg = res.routes[0].legs[0];
                        $('#pt-dist').text(leg.distance.text);
                        $('#pt-dur').text(leg.duration.text);
                        $('#pt-km').text((leg.distance.value / 1000).toFixed(1) + ' km');
                        const fecha = document.getElementById('pt-fecha')?.value || '';
                        const hora = document.getElementById('pt-hora')?.value || '00:00';
                        let dep = new Date();
                        if (fecha) {
                            const [dd, mm, yy] = fecha.split('/');
                            const [hh, mn] = hora.split(':');
                            dep = new Date(+yy, +mm - 1, +dd, +hh, +mn);
                        }
                        const arr = new Date(dep.getTime() + leg.duration.value * 1000);
                        $('#pt-out').text(dep.toLocaleString());
                        $('#pt-arr').text(arr.toLocaleString());
                        let peajes = 0;
                        leg.steps.forEach(s => {
                            if ((s.instructions || '').toLowerCase().includes('toll'))
                                peajes++;
                        });
                        $('#pt-tolls').text(String(peajes));
                        dr && dr.setDirections(res);
                    }
                });
            } else {
                const url = '/shoppi/obtener';
                const payload = {origen: o, destino: d, fecha: (document.getElementById('pt-fecha')?.value || ''), hora: (document.getElementById('pt-hora')?.value || ''), tipoVehiculo: (document.getElementById('pt-tipo')?.value || ''), estado: 'sin_asignacion'};
                fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(payload)})
                        .then(r => r.ok ? r.json() : Promise.reject(r)).then(resp => {
                    if (resp && resp.estado === true && resp.salida) {
                        const s = resp.salida;
                        $('#pt-dist').text(s.distancia || '—');
                        $('#pt-dur').text(s.duracion || '—');
                        $('#pt-km').text(s.km || '—');
                    }
                });
            }
        };
        ['pt-origen', 'pt-destino', 'pt-fecha', 'pt-hora', 'pt-tipo'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', calc);
                el.addEventListener('change', calc);
            }
        });
        setTimeout(calc, 10);
    }

    $(document).on('click', '.cs-del', function () {
        const id = $(this).data('id');
        const footer = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>' +
                '<button class="btn btn-danger" id="pt-confirm-del" data-id="' + id + '">Eliminar</button>';
        app.modal.show({title: 'Eliminar Solicitud ' + id, body: '<div class="text-muted">¿Confirmas eliminar esta solicitud?</div>', footer: footer, centered: true});
    });
    $(document).on('click', '#pt-confirm-del', function () {
        const id = $(this).data('id');
        $.ajax({type: 'DELETE', url: '/shoppi/peticiones/' + id, dataType: 'json'})
                .done(function () {
                    app.modal.hide();
                    if (dt)
                        dt.ajax.reload(null, false);
                    loadSummary();
                })
                .fail(function () {
                    alert('Error eliminando solicitud');
                });
    });
}
