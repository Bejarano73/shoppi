function iniciarInterfaz() {
    const root = document.getElementById('inspection-root');
    if (!root)
        return;
    if (root.__initRunning)
        return;
    root.__initRunning = true;
    try {
        app.spinner(true, 'Preparando inspección...');
    } catch {
    }
    const sumPend = document.getElementById('sum-pend');
    const sumOk = document.getElementById('sum-ok');
    const sumDef = document.getElementById('sum-def');
    const sumCrit = document.getElementById('sum-crit');
    // remaining is queried dynamically to avoid stale references when message content changes
    const msgEl = document.getElementById('ins-msg');
    const btnSolicitar = document.getElementById('btnSolicitar');
    const items = Array.from(root.querySelectorAll('.ins-item'));
    if (typeof app.upgradeSelectsBatch === 'function')
        app.upgradeSelectsBatch(root);
    const state = items.map(() => ({status: 'pendiente', comment: ''}));
    // indexar y setear visual inicial
    items.forEach((wrap, idx) => {
        wrap.dataset.idx = String(idx);
        let select = wrap.querySelector('.ins-select');
        if (select && select.tagName === 'SELECT') {
            const current = select.value || 'pendiente';
            const mwc = document.createElement('mwc-select');
            mwc.className = 'ins-select';
            mwc.setAttribute('label', 'Estado');
            ['pendiente', 'ok', 'defectivo'].forEach(v => {
                const li = document.createElement('mwc-list-item');
                li.setAttribute('value', v);
                li.textContent = v === 'ok' ? '✓ OK' : (v === 'defectivo' ? '✗ Defectivo' : 'Pendiente');
                mwc.appendChild(li);
            });
            mwc.value = current;
            select.replaceWith(mwc);
            select = mwc;
        }
        const comment = wrap.querySelector('.ins-comment');
        if (select)
            select.value = 'pendiente';
        wrap.classList.remove('state-ok', 'state-def');
        wrap.classList.add('state-pend');
        if (comment)
            comment.classList.add('d-none');
    });
    // delegación de eventos para evitar duplicados
    if (!root.__listenersAttached) {
        root.addEventListener('change', (ev) => {
            const sel = ev.target.closest('.ins-select');
            if (!sel)
                return;
            const wrap = sel.closest('.ins-item');
            const idx = wrap ? Number(wrap.dataset.idx || 0) : 0;
            const res = (typeof app.applyInspectionSelect === 'function') ? app.applyInspectionSelect(sel) : {status: sel.value === 'ok' ? 'ok' : (sel.value === 'defectivo' ? 'defectivo' : 'pendiente')};
            state[idx].status = res.status;
            updateSummary();
            if (typeof app.recountInspection === 'function')
                app.recountInspection(root);
        });
        // soporte para mwc-select (emite 'selected')
        root.addEventListener('selected', (ev) => {
            const sel = ev.target.closest('.ins-select');
            if (!sel)
                return;
            const wrap = sel.closest('.ins-item');
            const idx = wrap ? Number(wrap.dataset.idx || 0) : 0;
            const res = (typeof app.applyInspectionSelect === 'function') ? app.applyInspectionSelect(sel) : {status: sel.value === 'ok' ? 'ok' : (sel.value === 'defectivo' ? 'defectivo' : 'pendiente')};
            state[idx].status = res.status;
            updateSummary();
            if (typeof app.recountInspection === 'function')
                app.recountInspection(root);
        });
        root.addEventListener('input', (ev) => {
            const ta = ev.target.closest('.ins-comment');
            if (!ta)
                return;
            const wrap = ta.closest('.ins-item');
            const idx = wrap ? Number(wrap.dataset.idx || 0) : 0;
            state[idx].comment = ta.value;
            updateSummary();
        });
        root.__listenersAttached = true;
    }
    const updateSummary = () => {
        const pend = state.filter(v => v.status === 'pendiente').length;
        const ok = state.filter(v => v.status === 'ok').length;
        const def = state.filter(v => v.status === 'defectivo').length;
        const crit = items.reduce((m, wrap, i) => m + ((wrap.querySelector('.ins-critical') && state[i].status !== 'ok') ? 1 : 0), 0);
        if (sumPend)
            sumPend.textContent = String(pend);
        const remainingElDyn = document.getElementById('ins-remaining');
        if (remainingElDyn)
            remainingElDyn.textContent = String(pend);
        if (sumOk)
            sumOk.textContent = String(ok);
        if (sumDef)
            sumDef.textContent = String(def);
        if (sumCrit)
            sumCrit.textContent = String(crit);
        const allSelected = state.every(v => v.status !== 'pendiente');
        if (btnSolicitar)
            btnSolicitar.disabled = !allSelected;
        if (msgEl) {
            if (allSelected) {
                msgEl.classList.remove('ins-alert');
                msgEl.classList.add('ins-ok-alert');
                msgEl.innerHTML = '<i class="bi bi-check-circle-fill"></i><span>Inspección completa • Puedes solicitar autorización</span>';
            } else {
                msgEl.classList.remove('ins-ok-alert');
                msgEl.classList.add('ins-alert');
                msgEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i><span>Inspección incompleta • Completa la inspección de los <span id="ins-remaining">' + pend + '</span> elemento(s) restante(s)</span>';
            }
        }
    };
    updateSummary();
    const done = () => {
        try {
            app.spinner(false);
        } catch {
        }
    };
    if (window._cssReady && window._cssReady['solicitar-viaje'])
        done();
    else
        setTimeout(done, 0);
    const cancelarSolicitud = () => {
        try {
            app.spinner(true, 'Reiniciando formulario...');
        } catch {
        }
        const container = document.getElementById('page-content');
        if (container) {
            container.querySelectorAll('.form-control').forEach(el => {
                el.value = '';
            });
            container.querySelectorAll('.form-check-input').forEach(el => {
                el.checked = false;
            });
        }
        for (let i = 0; i < state.length; i++) {
            state[i] = {status: 'pendiente', comment: ''};
        }
        root.querySelectorAll('.ins-select').forEach(sel => {
            sel.value = 'pendiente';
            sel.classList.remove('select-ok', 'select-def');
            const wrap = sel.closest('.ins-item');
            if (wrap) {
                wrap.classList.remove('state-ok', 'state-def');
                wrap.classList.add('state-pend');
            }
        });
        root.querySelectorAll('.ins-comment').forEach(c => {
            c.value = '';
            c.classList.add('d-none');
        });
        if (typeof window.appClearSignature === 'function') {
            window.appClearSignature('sigConductor');
            window.appClearSignature('sigSupervisor');
        }
        updateSummary();
        setTimeout(() => {
            try {
                app.spinner(false);
            } catch {
            }
        }, 400);
    };
    window.cancelarSolicitud = cancelarSolicitud;
    if (window.jQuery) {
        jQuery('.cancelar_proceso').off('click.sv').on('click.sv', cancelarSolicitud);
    }
    root.__initRunning = false;
}
const cancelarSolicitud = () => {
    try {
        app.spinner(true, 'Reiniciando formulario...');
    } catch {
    }
    const container = document.getElementById('page-content');
    if (container) {
        container.querySelectorAll('.form-control').forEach(el => {
            el.value = '';
        });
        container.querySelectorAll('.form-check-input').forEach(el => {
            el.checked = false;
        });
    }
    for (let i = 0; i < state.length; i++) {
        state[i] = {status: 'pendiente', comment: ''};
    }
    root.querySelectorAll('.ins-select').forEach(sel => {
        sel.value = 'pendiente';
        sel.classList.remove('select-ok', 'select-def');
        const wrap = sel.closest('.ins-item');
        if (wrap) {
            wrap.classList.remove('state-ok', 'state-def');
            wrap.classList.add('state-pend');
        }
    });
    root.querySelectorAll('.ins-comment').forEach(c => {
        c.value = '';
        c.classList.add('d-none');
    });
    if (typeof window.appClearSignature === 'function') {
        window.appClearSignature('sigConductor');
        window.appClearSignature('sigSupervisor');
    }
    updateSummary();
    setTimeout(() => {
        try {
            app.spinner(false);
        } catch {
        }
    }, 400);
};
window.cancelarSolicitud = cancelarSolicitud;
if (window.jQuery) {
    jQuery('.cancelar_proceso').off('click.sv').on('click.sv', cancelarSolicitud);
}
if (window.jQuery) {
    jQuery(function () {
        iniciarInterfaz();
    });
}


