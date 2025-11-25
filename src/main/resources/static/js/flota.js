(() => {
    function iniciarInterfazFlota() {
        const tbl = document.getElementById('flota-table');
        const searchEl = document.getElementById('fl-search');
        const estEl = document.getElementById('fl-estado');
        if (!tbl)
            return;
        const $t = window.jQuery ? jQuery(tbl) : null;
        const ensureDT = () => new Promise((resolve) => {
                if (window.jQuery && jQuery.fn && typeof jQuery.fn.DataTable === 'function')
                    return resolve(true);
                const add = (src) => new Promise(ok => {
                        const s = document.createElement('script');
                        s.src = src;
                        s.onload = () => ok(true);
                        s.onerror = () => ok(false);
                        document.body.appendChild(s);
                    });
                (async() => {
                    if (!window.jQuery) {
                        const s = document.createElement('script');
                        s.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
                        document.body.appendChild(s);
                    }
                    await add('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js');
                    await add('https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js');
                    resolve(window.jQuery && jQuery.fn && typeof jQuery.fn.DataTable === 'function');
                })();
            });
        const ajaxSrc = (json) => {
            if (json && json.estado === true && json.salida && Array.isArray(json.salida.items))
                return json.salida.items;
            return [];
        };
        const cols = [
            {data: 'placa', render: (v) => '<strong>' + (v || '') + '</strong>'},
            {data: null, render: (r) => (r.vehiculo || '') + '<div class="text-muted">' + (r.anio ? r.anio + ' • ' : '') + (r.tipo || '') + '</div>'},
            {data: null, render: (r) => (r.conductor || '') + '<div class="text-muted">' + (r.cel || '') + '</div>'},
            {data: 'kmMes', render: (v) => '<strong>' + (v || '0') + ' km</strong>'},
            {data: 'kmTotal', render: (v) => (v || '0') + ' km'},
            {data: 'estado', render: (v) => {
                    const m = {activo: 'success', inactivo: 'secondary', mantenimiento: 'warning'};
                    const cls = m[String(v || '').toLowerCase()] || 'secondary';
                    return '<span class="badge bg-' + cls + '">' + (v || '').charAt(0).toUpperCase() + (v || '').slice(1) + '</span>';
                }},
            {data: null, orderable: false, render: (r) => '<button class="btn btn-success btn-sm fl-ver" data-placa="' + (r.placa || '') + '"><i class="bi bi-eye"></i> Ver</button>'}
        ];
        const openDetalle = (placa) => {
            const url = '/flota-detalle?placa=' + encodeURIComponent(placa || '');
            if (window.htmx) {
                htmx.ajax('GET', url, {target: '#app-content', swap: 'innerHTML', select: '#page-content', history: true});
            } else {
                location.href = url;
            }
        };
        ensureDT().then((ok) => {
            if (ok && $t) {
                const dt = $t.DataTable({ajax: {url: '/shoppi/flota', dataSrc: ajaxSrc}, columns: cols, order: [[0, 'asc']], pageLength: 10, dom: 'rtip', scrollX: true});
                if (searchEl)
                    searchEl.addEventListener('input', () => dt.search(searchEl.value || '').draw());
                if (estEl) {
                    const apply = () => {
                        const v = (estEl.value || (estEl.querySelector('mwc-list-item[selected]')?.getAttribute('value') || ''));
                        dt.column(5).search(v ? '^' + v + '$' : '', true, false).draw();
                    };
                    estEl.addEventListener('change', apply);
                    estEl.addEventListener('selected', apply);
                }
                jQuery(document).on('click', '.fl-ver', function () {
                    const placa = jQuery(this).data('placa');
                    openDetalle(placa);
                });
                document.addEventListener('click', (ev) => {
                    const btn = ev.target.closest('.fl-ver');
                    if (btn) {
                        ev.preventDefault();
                        openDetalle(btn.getAttribute('data-placa') || '');
                    }
                });
                return;
            }
            fetch('/shoppi/flota').then(r => r.ok ? r.json() : Promise.reject(r)).then(resp => {
                const items = (resp && resp.estado === true && resp.salida && Array.isArray(resp.salida.items)) ? resp.salida.items : [];
                const tbody = document.createElement('tbody');
                items.forEach(r => {
                    const tr = document.createElement('tr');
                    const cells = [
                        '<strong>' + (r.placa || '') + '</strong>',
                        (r.vehiculo || '') + '<div class="text-muted">' + (r.anio ? r.anio + ' • ' : '') + (r.tipo || '') + '</div>',
                        (r.conductor || '') + '<div class="text-muted">' + (r.cel || '') + '</div>',
                        '<strong>' + (r.kmMes || '0') + ' km</strong>',
                        (r.kmTotal || '0') + ' km',
                        (function (v) {
                            const m = {activo: 'success', inactivo: 'secondary', mantenimiento: 'warning'};
                            const cls = m[String(v || '').toLowerCase()] || 'secondary';
                            return '<span class="badge bg-' + cls + '">' + (v || '') + '</span>';
                        })(r.estado),
                        '<button class="btn btn-success btn-sm fl-ver" data-placa="' + (r.placa || '') + '"><i class="bi bi-eye"></i> Ver</button>'
                    ];
                    cells.forEach(h => {
                        const td = document.createElement('td');
                        td.innerHTML = h;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                const old = tbl.querySelector('tbody');
                if (old)
                    old.remove();
                tbl.appendChild(tbody);
                if (searchEl)
                    searchEl.addEventListener('input', () => {
                        const q = (searchEl.value || '').toLowerCase();
                        Array.from(tbody.children).forEach(tr => {
                            tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
                        });
                    });
                if (estEl) {
                    const apply = () => {
                        const v = (estEl.value || (estEl.querySelector('mwc-list-item[selected]')?.getAttribute('value') || ''));
                        Array.from(tbody.children).forEach(tr => {
                            const badge = tr.querySelector('.badge');
                            const ok = !v || (badge && (badge.textContent || '').toLowerCase() === v.toLowerCase());
                            tr.style.display = ok ? '' : 'none';
                        });
                    };
                    estEl.addEventListener('change', apply);
                    estEl.addEventListener('selected', apply);
                }
                document.addEventListener('click', (ev) => {
                    const btn = ev.target.closest('.fl-ver');
                    if (btn) {
                        ev.preventDefault();
                        openDetalle(btn.getAttribute('data-placa') || '');
                    }
                });
            }).catch(() => {
            });
        }).catch(() => {
        });
    }
    function iniciarInterfazFlotaDetalle() {
        const root = document.getElementById('page-content');
        if (!root)
            return;
        const params = new URLSearchParams(location.search);
        const placa = params.get('placa') || '';
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el)
                el.textContent = val;
        };
        const onData = (d) => {
            set('fd-placa', d.placa || '');
            set('fd-modelo', (d.vehiculo || '') + ' (' + (d.anio || '') + ')');
            set('fd-km-total', d.kmTotal || '');
            set('fd-km-mes', d.kmMes || '');
            set('fd-conductor', d.conductor || '');
            set('fd-consumo', d.consumo || '');
            const est = document.getElementById('fd-estado');
            if (est) {
                const m = {activo: 'success', inactivo: 'secondary', mantenimiento: 'warning'};
                const c = m[String(d.estado || '').toLowerCase()] || 'secondary';
                est.className = 'badge bg-' + c;
                est.textContent = (d.estado || 'Activo');
            }
            set('fd-frenos', d.estados?.frenos || '');
            set('fd-suspension', d.estados?.suspension || '');
            set('fd-luces', d.estados?.luces || '');
            set('fd-aceite', d.estados?.aceite || '');
            const docs = d.docs || [];
            const cont = document.getElementById('fd-docs');
            if (cont) {
                cont.innerHTML = '';
                docs.slice(0, 5).forEach(x => {
                    const div = document.createElement('div');
                    div.className = 'd-flex justify-content-between align-items-center p-2 rounded ' + (x.vencido ? 'bg-danger-subtle' : 'bg-success-subtle');
                    div.innerHTML = '<div>' + x.nombre + '</div><div class="text-success">' + (x.restante || '') + '</div>';
                    cont.appendChild(div);
                });
            }
            const docsList = document.getElementById('fd-docs-list');
            if (docsList) {
                docsList.innerHTML = '';
                docs.forEach(x => {
                    const div = document.createElement('div');
                    div.className = 'd-flex justify-content-between align-items-center p-3 rounded border ' + (x.vencido ? 'border-danger bg-danger-subtle' : 'border-success bg-success-subtle');
                    div.innerHTML = '<div><i class="bi bi-file-earmark-text me-2"></i>' + x.nombre + '<div class="text-muted small">Expedición: ' + (x.expedicion || '—') + ' • Vencimiento: ' + (x.vencimiento || '—') + '</div></div><div class="text-' + (x.vencido ? 'danger' : 'success') + '">' + (x.vencido ? 'Vencido' : (x.restante || '')) + '</div>';
                    docsList.appendChild(div);
                });
            }
        };
        fetch('/shoppi/flota/' + encodeURIComponent(placa)).then(r => r.ok ? r.json() : Promise.reject(r)).then(resp => {
            if (resp && resp.estado === true && resp.salida)
                onData(resp.salida);
        }).catch(() => {
            onData({placa: placa || 'CTM-001', vehiculo: 'Volvo FH16', anio: '2022', tipo: 'volqueta', kmTotal: '145.230 km', kmMes: '3.560 km', conductor: 'Juan Carlos Rodríguez', consumo: '5.2 km/l', estado: 'activo', estados: {frenos: 'Good', suspension: 'Good', luces: 'All_working', aceite: 'Good'}, docs: [{nombre: 'SOAT', restante: '37 días'}, {nombre: 'Tecnomecánica', vencido: true}, {nombre: 'Seguro Contractual', restante: '37 días'}, {nombre: 'Tarjeta de Propiedad', vencido: true}, {nombre: 'Certificado de Emisiones', vencido: true}]});
        });
    }
    window.iniciarInterfazFlota = iniciarInterfazFlota;
    window.iniciarInterfazFlotaDetalle = iniciarInterfazFlotaDetalle;
    document.addEventListener('htmx:afterSwap', (e) => {
        if (e.detail && e.detail.target && e.detail.target.id === 'app-content') {
            try {
                if (document.getElementById('flota-table'))
                    iniciarInterfazFlota();
                else
                    iniciarInterfazFlotaDetalle();
            } catch {
            }
        }
    });
    if (document.readyState !== 'loading') {
        try {
            if (document.getElementById('flota-table'))
                iniciarInterfazFlota();
            else
                iniciarInterfazFlotaDetalle();
        } catch {
        }
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                if (document.getElementById('flota-table'))
                    iniciarInterfazFlota();
                else
                    iniciarInterfazFlotaDetalle();
            } catch {
            }
        });
    }
})();

