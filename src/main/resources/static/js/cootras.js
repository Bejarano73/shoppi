$(document).ready(function () {
    iniciarInterfaz();
});

function iniciarInterfaz() {
    spinner("Cargando librerias...");
    libreria_parcialesJS();
    crearItemDocumento();
}

function libreria_parcialesJS() {
    console.log("entras?");
    particlesJS("particles-js", {
        particles: {
            number: {value: 80},
            color: {value: "#bfc7d5"},
            shape: {type: "circle"},
            opacity: {value: 0.5},
            size: {value: 2},
            line_linked: {
                enable: true,
                distance: 150,
                color: "#cbd2e0",
                opacity: 0.4,
                width: 1
            },
            move: {enable: true, speed: 1}
        },
        interactivity: {
            events: {
                onhover: {enable: true, mode: "grab"}
            }
        },
        retina_detect: true
    });
}

const app = {
    setToggleIcon(open) {
        const icon = document.getElementById('menu-icon');
        if (!icon)
            return;
        icon.classList.add('icon-anim');
        icon.classList.toggle('bi-list', !open);
        icon.classList.toggle('bi-x', open);
        setTimeout(() => icon.classList.remove('icon-anim'), 250);
    },
    cerrar_session() {
        const done = (ok) => {
            try {
                app.spinner(false);
            } catch {
            }
            if (ok) {
                location.href = '/';
            } else {
                alert('No se pudo cerrar la sesión. Recargando página...');
                location.reload();
            }
        }
        try {
            app.spinner(true, 'Cerrando sesión...');
        } catch {
        }
        if (window.jQuery) {
            jQuery.ajax({url: '/usuario/cerrarsession', method: 'POST'})
                    .done(() => done(true))
                    .fail(() => done(false))
        } else {
            fetch('/usuario/cerrarsession', {method: 'POST'})
                    .then(r => done(r.ok))
                    .catch(() => done(false))
        }
    },
    setTitleAndDescFromContent() {
        const pc = document.getElementById('page-content');
        if (!pc)
            return;
        const title = pc.getAttribute('data-title') || pc.querySelector('h4')?.textContent || '';
        const subtitle = pc.getAttribute('data-subtitle') || pc.querySelector('.page-subtitle')?.textContent || '';
        const titleEl = document.querySelector('.app-title');
        const subEl = document.querySelector('.app-subtitle');
        if (titleEl)
            titleEl.textContent = title;
        if (subEl)
            subEl.textContent = subtitle;
    },
    adjustOverflow() {
        const containers = document.querySelectorAll('#app-content.height-app-coostra');
        if (!containers.length)
            return;
        const headerEl = document.querySelector('.app-header');
        const footerEl = document.querySelector('.app-footer');
        const hVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
        const fVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footer-h')) || 0;
        const h = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : hVar;
        const f = footerEl ? Math.ceil(footerEl.getBoundingClientRect().height) : fVar;
        const avail = Math.max(0, window.innerHeight - h - f);
        containers.forEach(ac => {
            ac.style.height = `${avail}px`;
            const pc = ac.querySelector('.coostra-scroll') || ac.querySelector('#page-content');
            if (!pc)
                return;
            const acs = getComputedStyle(ac);
            const acPad = (parseFloat(acs.paddingTop) || 0) + (parseFloat(acs.paddingBottom) || 0);
            const pcs = getComputedStyle(pc);
            const pcMargin = (parseFloat(pcs.marginTop) || 0) + (parseFloat(pcs.marginBottom) || 0);
            const usable = Math.max(0, avail - acPad - pcMargin);
            pc.style.maxHeight = `${usable}px`;
        });
    },
    setActiveMenuByPath(path) {
        document.querySelectorAll('.app-sidebar .nav-link').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === path);
        });
        try {
            sessionStorage.setItem('activePath', path);
        } catch {
        }
    },

    initSignatures() {
        if (typeof window.SignaturePad === 'undefined')
            return;
        document.querySelectorAll('.sv-sig-pad[data-signature]').forEach(canvas => {
            try {
                const ensureResize = () => {
                    const ratio = Math.max(window.devicePixelRatio || 1, 1);
                    const rect = canvas.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0)
                        return; // invisible
                    canvas.width = Math.floor(rect.width * ratio);
                    canvas.height = Math.floor(rect.height * ratio);
                    const ctx = canvas.getContext('2d');
                    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                    if (canvas.__pad)
                        canvas.__pad.clear();
                };
                if (!canvas.__pad) {
                    canvas.__pad = new window.SignaturePad(canvas, {backgroundColor: '#ffffff', penColor: '#0f172a', minWidth: 1.5, maxWidth: 2.5});
                    canvas.__resize = () => ensureResize();
                    window.addEventListener('resize', canvas.__resize);
                }
                ensureResize();
                setTimeout(ensureResize, 100);
            } catch {
            }
        });
        window.appClearSignature = (id) => {
            const c = document.getElementById(id);
            if (c && c.__pad)
                c.__pad.clear();
        };
    },
    userMenu: {
        el: null,
        open(btn) {
            this.close();
            const menu = document.createElement('ul');
            menu.className = 'dropdown-menu show app-user-menu rounded-4 shadow-sm';
            menu.setAttribute('role', 'menu');
            menu.innerHTML = `
                <div class="d-flex flex-column align-items-center text-center p-3">
                    <div class="app-user-avatar rounded-circle bg-030045 d-inline-flex align-items-center justify-content-center">
                        <i class="bi bi-truck text-white"></i>
                    </div>
                    <h6 class="user-name m-0" id="appUserName"></h6>
                    <small class="user-id" id="appUserId"></small>
                </div>
                <ul class="p-1 bg-white rounded-4 list-unstyled m-0">
                    <li class="dropdown_lista_elemt cursor py-1"><a class="dropdown-lista-menu text-030045 d-flex align-items-center gap-2" id="appMenuProfile"><i class="bi bi-person"></i><span>Perfil</span></a></li>
                    <li class="dropdown_lista_elemt cursor py-1"><a class="dropdown-lista-menu text-030045 d-flex align-items-center gap-2" id="appMenuSettings"><i class="bi bi-gear"></i><span>Configuración</span></a></li>
                    <li class="dropdown_lista_elemt cursor py-1"><a class="dropdown-lista-menu text-030045 d-flex align-items-center gap-2" id="appMenuHelp"><i class="bi bi-question-circle"></i><span>Ayuda</span></a></li>
                    <li class="dropdown_lista_elemt cursor py-1"><a class="dropdown-lista-menu text-danger d-flex align-items-center gap-2" id="appMenuLogout"><i class="bi bi-box-arrow-right"></i><span>Salir</span></a></li>
                </ul>`;
            document.body.appendChild(menu);
            const r = btn.getBoundingClientRect();
            const width = 300;
            menu.style.position = 'absolute';
            menu.style.width = width + 'px';
            menu.style.top = (window.scrollY + r.bottom + 8) + 'px';
            menu.style.left = (window.scrollX + r.right - width) + 'px';
            try {
                const name = sessionStorage.getItem('user:name') || '';
                const id = sessionStorage.getItem('user:id') || '';
                const nameEl = menu.querySelector('#appUserName');
                const idEl = menu.querySelector('#appUserId');
                if (nameEl)
                    nameEl.textContent = name || 'Usuario';
                if (idEl)
                    idEl.textContent = id || '';
            } catch {
            }
            this.el = menu;
            const onDoc = (e) => {
                if (!menu.contains(e.target) && !btn.contains(e.target))
                    this.close();
            };
            document.addEventListener('click', onDoc, {once: true});
        },
        close() {
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
                this.el = null;
            }
        }
    },
    upgradeSelectsBatch(container) {
        try {
            const native = Array.from(container.querySelectorAll('select.ins-select'));
            if (!native.length)
                return;
            let i = 0;
            const batch = 6;
            const run = () => {
                const end = Math.min(i + batch, native.length);
                for (; i < end; i++) {
                    const sel = native[i];
                    const current = sel.value || 'pendiente';
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
                    sel.replaceWith(mwc);
                }
                if (i < native.length) {
                    if (window.requestIdleCallback)
                        requestIdleCallback(run);
                    else
                        setTimeout(run, 0);
                }
            };
            run();
        } catch {
        }
    },
    applyInspectionSelect(sel) {
        if (!sel)
            return {status: 'pendiente', value: 'pendiente'};
        const wrap = sel.closest('.ins-item');
        const comment = wrap ? wrap.querySelector('.ins-comment') : null;
        let status = 'pendiente';
        const raw = sel.value;
        if (raw === 'ok' || raw === '1') {
            status = 'ok';
        } else if (raw === 'defectivo' || raw === '0') {
            status = 'defectivo';
        } else {
            status = 'pendiente';
        }
        sel.classList.remove('select-ok', 'select-def');
        if (wrap)
            wrap.classList.remove('state-ok', 'state-def', 'state-pend');
        if (status === 'ok') {
            sel.classList.add('select-ok');
            if (wrap)
                wrap.classList.add('state-ok');
        } else if (status === 'defectivo') {
            sel.classList.add('select-def');
            if (wrap)
                wrap.classList.add('state-def');
        } else {
            if (wrap)
                wrap.classList.add('state-pend');
        }
        if (comment)
            comment.classList.toggle('d-none', status !== 'defectivo');
        return {status, value: raw};
    },
    recountInspection(container) {
        if (!container)
            return;
        const items = Array.from(container.querySelectorAll('.ins-item'));
        let pend = 0, ok = 0, def = 0, crit = 0;
        items.forEach(w => {
            const sel = w.querySelector('.ins-select');
            const v = sel ? sel.value : '';
            if (v === 'pendiente' || v === '')
                pend++;
            else if (v === 'ok' || v === '1')
                ok++;
            else if (v === 'defectivo' || v === '0')
                def++;
            if (w.querySelector('.ins-critical') && v !== 'ok' && v !== '1')
                crit++;
        });
        const sumPend = document.getElementById('sum-pend');
        const sumOk = document.getElementById('sum-ok');
        const sumDef = document.getElementById('sum-def');
        const sumCrit = document.getElementById('sum-crit');
        if (sumPend)
            sumPend.textContent = String(pend);
        if (sumOk)
            sumOk.textContent = String(ok);
        if (sumDef)
            sumDef.textContent = String(def);
        if (sumCrit)
            sumCrit.textContent = String(crit);
        const remainingEl = document.getElementById('ins-remaining');
        if (remainingEl)
            remainingEl.textContent = String(pend);
        const msgEl = document.getElementById('ins-msg');
        const btn = document.getElementById('btnSolicitar');
        const allSelected = pend === 0;
        if (btn)
            btn.disabled = !allSelected;
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
    },
    navigate(path) {
        try {
            sessionStorage.setItem('activePath', path);
        } catch {
        }
        if (window.htmx) {
            try {
                app.spinner(true, 'Cargando...');
            } catch {
            }
            htmx.ajax('GET', path, {
                target: '#app-content',
                swap: 'innerHTML',
                select: '#page-content',
                history: true
            }).finally(() => {
                try {
                    app.spinner(false);
                } catch {
                }
                app.adjustOverflow();
                app.initSignatures();
            });
        } else {
            // fallback: full navigation
            location.href = path;
            return;
        }
        app.setTitleAndDescFromContent();
        app.setActiveMenuByPath(path);
        const mq = window.matchMedia('(max-width: 991.98px)');
        if (mq.matches) {
            const el = document.getElementById('appSidebar');
            if (el && typeof bootstrap !== 'undefined') {
                const oc = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
                oc.hide();
                app.setToggleIcon(false);
                try {
                    sessionStorage.setItem('menuOpen', '0');
                } catch {
                }
            }
        }
    },
    toggleSidebar() {
        const mq = window.matchMedia('(min-width: 992px)');
        if (mq.matches) {
            const collapsing = document.body.classList.contains('sidebar-collapsed') || document.documentElement.classList.contains('sidebar-collapsed');
            if (collapsing) {
                // expand: espera a que termine la animación para mostrar el texto
                document.body.classList.add('sidebar-expanding');
                document.querySelectorAll('.menu-d-none').forEach(el => {
                    el.classList.add('d-none');
                    el.classList.remove('menu-text-show');
                });
                document.body.classList.remove('sidebar-collapsed');
                document.documentElement.classList.remove('sidebar-collapsed');
                setTimeout(() => {
                    document.body.classList.remove('sidebar-expanding');
                    document.querySelectorAll('.menu-d-none').forEach(el => {
                        el.classList.remove('d-none');
                        el.classList.add('menu-text-show');
                        setTimeout(() => el.classList.remove('menu-text-show'), 280);
                    });
                }, 320);
                app.setToggleIcon(true);
            } else {
                // collapse inmediato: oculta texto al instante
                document.body.classList.add('sidebar-collapsed');
                document.documentElement.classList.add('sidebar-collapsed');
                document.querySelectorAll('.menu-d-none').forEach(el => {
                    el.classList.add('d-none');
                    el.classList.remove('menu-text-show');
                });
                app.setToggleIcon(false);
            }
            try {
                sessionStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed') ? '1' : '0');
            } catch {
            }
            const footer = document.querySelector('.sidebar-footer');
            if (footer)
                footer.classList.toggle('d-none', document.body.classList.contains('sidebar-collapsed'));
            return;
        }
        const el = document.getElementById('appSidebar');
        if (!el || typeof bootstrap === 'undefined')
            return;
        const oc = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el, {backdrop: false, scroll: true});
        if (el.classList.contains('show')) {
            oc.hide();
            app.setToggleIcon(false);
        } else {
            const footer = document.querySelector('.sidebar-footer');
            if (footer)
                footer.classList.remove('d-none');
            document.querySelectorAll('.menu-d-none').forEach(el => el.classList.add('d-none'));
            oc.show();
            const onShown = () => {
                document.querySelectorAll('.menu-d-none').forEach(el => {
                    el.classList.remove('d-none');
                    el.classList.add('menu-text-show');
                    setTimeout(() => el.classList.remove('menu-text-show'), 280);
                });
                el.removeEventListener('shown.bs.offcanvas', onShown);
                app.setToggleIcon(true);
            };
            el.addEventListener('shown.bs.offcanvas', onShown);
        }
    },
    modalApp(title, html, footer) {
        let body = '';
        let ft = '';
        const placeholder = '<div class="modal-empty text-center text-muted py-4">Esperando contenido…</div>';
        const hasButtons = typeof html === 'string' && /<button|btn\s|role=\"button\"|data-bs-dismiss/.test(html);
        if (typeof footer === 'string' && footer.trim()) {
            body = typeof html === 'string' ? html : '';
            ft = footer;
        } else if (hasButtons) {
            ft = html;
            body = placeholder;
        } else {
            body = typeof html === 'string' && html.trim() ? html : placeholder;
            ft = '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>';
        }
        app.modal.show({title: title || '', body: body, footer: ft, centered: true, scrollable: true});
    },
    openSettings() {
        const body = `
            <ul class="nav nav-tabs">
                <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabGeneral" type="button">General</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabSistema" type="button">Sistema</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabIntegraciones" type="button">Integraciones</button></li>
            </ul>
            <div class="tab-content pt-3">
                <div class="tab-pane fade show active" id="tabGeneral">
                    <div class="row g-3">
                        <div class="col-12">
                            <mwc-textfield label="Nombre de la Empresa" value="Cootrasmateriales"></mwc-textfield>
                        </div>
                        <div class="col-12">
                            <mwc-textfield label="Sub Nombre de la Empresa" value="Gestion de Flota"></mwc-textfield>
                        </div>
                        <div class="col-md-6">
                            <mwc-textfield type="email" label="Email de Contacto" value="contacto@cootrasmateriales.com"></mwc-textfield>
                        </div>
                        <div class="col-md-6">
                            <mwc-textfield label="Teléfono" value="+57 1 2345678"></mwc-textfield>
                        </div>
                        <div class="col-12">
                            <mwc-textfield label="Dirección" value="Bogotá, Colombia"></mwc-textfield>
                        </div>
                    </div>
                 </div>
                <div class="tab-pane fade" id="tabSistema">
              <div class="row g-3">
            <div class="col-12 col-lg-4">
                <mwc-textfield label="Código para registro empleados" value="EMPLEADOS_2025"></mwc-textfield>
            </div>
            <div class="col-12 col-lg-4">
                <mwc-textfield label="Código para registro conductores" value="CONDUCTORE_S2025"></mwc-textfield>
            </div>
            <div class="col-12 col-lg-4">
                <mwc-textfield label="Código para registro vehiculos" value="VEHICULOS_2025"></mwc-textfield>
            </div>
            <div class="col-12">
                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <input type="checkbox" id="notifications" class="w-4 h-4 rounded border-gray-300 text-brand-green" checked>
                    <label for="notifications" class="text-sm font-medium text-gray-900">Habilitar notificaciones por correo - OTP de seguridad</label>
                </div>
            </div>
        </div>
            </div>
                <div class="tab-pane fade" id="tabIntegraciones">
                    <div class="text-muted">Integraciones con servicios externos.</div>
                </div>
            </div>
        `;
        const footer = `
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success ms-2">Guardar Cambios</button>
        `;
        app.modal.show({
            title: 'Configuración del Sistema',
            subtitle: 'Gestione la configuración de su sistema de gestión de flotas',
            body,
            footer,
            size: 'xl',
            centered: true,
            scrollable: true
        });
        app.guardando(false);
        const modalEl = document.getElementById('appModal');
        const footerEl = modalEl ? modalEl.querySelector('.footer-modal-app') : null;
        const primaryBtn = footerEl ? footerEl.querySelector('.btn-success') : null;
        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                if (!primaryBtn.disabled) {
                    app.guardando(true, 1000);
                }
            });
        }
    },
    modal: {
        show(opts = {}) {
            const el = document.getElementById('appModal');
            if (!el || typeof bootstrap === 'undefined')
                return;
            const titleEl = el.querySelector('.titulo-model-app');
            const subtitleEl = el.querySelector('.subtitle-modal-app');
            const bodyEl = el.querySelector('.modal-header-app');
            const footerEl = el.querySelector('.footer-modal-app');
            const headerEl = document.getElementById('appModalHeader');
            const dialogEl = document.getElementById('appModalDialog');
            const contentEl = document.getElementById('appModalContent');
            const title = opts.title ?? '';
            const subtitle = opts.subtitle ?? '';
            const body = opts.body ?? '';
            const footer = opts.footer ?? '';
            titleEl.textContent = title;
            headerEl.classList.toggle('d-none', !title);
            if (subtitle) {
                subtitleEl.classList.remove('d-none');
                subtitleEl.textContent = subtitle;
            } else {
                subtitleEl.classList.add('d-none');
                subtitleEl.textContent = '';
            }
            bodyEl.innerHTML = body;
            if (opts.bodyClasses) {
                bodyEl.className = 'modal-body modal-header-app ' + opts.bodyClasses;
            } else {
                bodyEl.className = 'modal-body modal-header-app';
            }
            if (footer) {
                footerEl.classList.remove('d-none');
                footerEl.innerHTML = footer;
            } else {
                footerEl.classList.add('d-none');
                footerEl.innerHTML = '';
            }
            if (!footerEl.classList.contains('d-none')) {
                let statusEl = footerEl.querySelector('.modal-status');
                if (!statusEl) {
                    statusEl = document.createElement('div');
                    statusEl.className = 'modal-status d-none';
                    footerEl.prepend(statusEl);
                }
                let actionsEl = footerEl.querySelector('.modal-actions');
                if (!actionsEl) {
                    actionsEl = document.createElement('div');
                    actionsEl.className = 'modal-actions ms-auto d-flex align-items-center gap-2';
                    const nodes = Array.from(footerEl.children).filter(c => !c.classList.contains('modal-status'));
                    nodes.forEach(n => actionsEl.appendChild(n));
                    footerEl.appendChild(actionsEl);
                }
            }
            dialogEl.classList.remove('modal-sm', 'modal-lg', 'modal-xl', 'modal-dialog-centered', 'modal-dialog-scrollable');
            if (opts.size === 'sm')
                dialogEl.classList.add('modal-sm');
            if (opts.size === 'lg')
                dialogEl.classList.add('modal-lg');
            if (opts.size === 'xl')
                dialogEl.classList.add('modal-xl');
            if (opts.centered)
                dialogEl.classList.add('modal-dialog-centered');
            if (opts.scrollable)
                dialogEl.classList.add('modal-dialog-scrollable');
            if (opts.contentClasses)
                contentEl.className = 'modal-content ' + opts.contentClasses;
            else
                contentEl.className = 'modal-content';
            const instance = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el, {backdrop: opts.backdrop ?? true, keyboard: true, focus: true});
            instance.show();
        },
        hide() {
            const el = document.getElementById('appModal');
            if (!el || typeof bootstrap === 'undefined')
                return;
            const instance = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
            instance.hide();
        },
        clear() {
            const el = document.getElementById('appModal');
            if (!el)
                return;
            const titleEl = el.querySelector('.titulo-model-app');
            const subtitleEl = el.querySelector('.subtitle-modal-app');
            const bodyEl = el.querySelector('.modal-header-app');
            const footerEl = el.querySelector('.footer-modal-app');
            const headerEl = document.getElementById('appModalHeader');
            titleEl.textContent = '';
            headerEl.classList.add('d-none');
            subtitleEl.classList.add('d-none');
            subtitleEl.textContent = '';
            bodyEl.innerHTML = '';
            footerEl.classList.add('d-none');
            footerEl.innerHTML = '';
        }
    },
    guardando(active, ms = 0) {
        const el = document.getElementById('appModal');
        if (!el)
            return;
        const footerEl = el.querySelector('.footer-modal-app');
        if (!footerEl || footerEl.classList.contains('d-none'))
            return;
        let statusEl = footerEl.querySelector('.modal-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'modal-status d-none';
            footerEl.prepend(statusEl);
        }
        let actionsEl = footerEl.querySelector('.modal-actions');
        if (!actionsEl) {
            actionsEl = document.createElement('div');
            actionsEl.className = 'modal-actions ms-auto d-flex align-items-center gap-2';
            const nodes = Array.from(footerEl.children).filter(c => !c.classList.contains('modal-status'));
            nodes.forEach(n => actionsEl.appendChild(n));
            footerEl.appendChild(actionsEl);
        }
        const primaryBtn = actionsEl.querySelector('.btn-success');
        const showSaving = () => {
            statusEl.innerHTML = '<div class="spinner-border text-success spinner-border-sm me-2" role="status"></div><span class="status-text">Guardando configuración..</span>';
            statusEl.classList.remove('d-none');
            if (primaryBtn) {
                primaryBtn.disabled = true;
                if (!primaryBtn.querySelector('.spinner-border')) {
                    const s = document.createElement('span');
                    s.className = 'spinner-border spinner-border-sm me-2';
                    primaryBtn.prepend(s);
                }
            }
            app.spinner(true, 'Guardando configuración..');
        };
        const showSuccess = () => {
            statusEl.innerHTML = '<i class="bi bi-check-circle-fill me-2 text-success"></i><span class="status-text">Configuración guardada exitosamente</span>';
            statusEl.classList.remove('d-none');
            if (primaryBtn) {
                primaryBtn.disabled = false;
                const sb = primaryBtn.querySelector('.spinner-border');
                if (sb)
                    sb.remove();
            }
            const txtEl = document.getElementById('text-spinner');
            if (txtEl)
                txtEl.innerHTML = 'Configuración guardada exitosamente';
        };
        const clearAll = () => {
            statusEl.classList.add('d-none');
            statusEl.innerHTML = '';
            if (primaryBtn) {
                primaryBtn.disabled = false;
                const sb = primaryBtn.querySelector('.spinner-border');
                if (sb)
                    sb.remove();
            }
            app.spinner(false);
        };
        clearTimeout(app._savingTimer1);
        clearTimeout(app._savingTimer2);
        if (active) {
            showSaving();
            if (ms && ms > 0) {
                const half = Math.floor(ms / 2);
                app._savingTimer1 = setTimeout(showSuccess, half);
                app._savingTimer2 = setTimeout(clearAll, ms);
            }
        } else {
            if (ms && ms > 0) {
                const half = Math.floor(ms / 2);
                showSuccess();
                app._savingTimer2 = setTimeout(clearAll, ms);
            } else {
                clearAll();
            }
    }
    },
    spinner(mostrar, param = null, duracionMs = null) {
        window.__spinnerActiveIds = window.__spinnerActiveIds || new Set();
        let sp = document.getElementById('spinner');
        let txt = document.getElementById('text-spinner');
        if (!sp) {
            sp = document.createElement('div');
            sp.id = 'spinner';
            sp.className = 'global-spinner d-none';
            const img = document.createElement('img');
            img.src = '/img/spinner.gif';
            img.alt = 'Cargando';
            img.className = 'spinner-icon-img';
            img.onerror = () => {
                const icon = document.createElement('div');
                icon.className = 'spinner-icon spinner-border text-success';
                icon.setAttribute('role', 'status');
                img.replaceWith(icon);
            };
            const t = document.createElement('div');
            t.id = 'text-spinner';
            t.className = 'spinner-text text-success mt-2';
            t.textContent = 'Cargando...';
            sp.appendChild(img);
            sp.appendChild(t);
            document.body.appendChild(sp);
            txt = t;
        }
        const genId = () => Math.random().toString(36).substr(2, 9);
        const show = (id, msg) => {
            window.__spinnerActiveIds.add(id);
            sp.setAttribute('data-id', id);
            sp.classList.remove('d-none');
            if (txt)
                txt.innerHTML = msg || 'Cargando...';
            return id;
        };
        const hideById = (id) => {
            window.__spinnerActiveIds.delete(id);
            if (window.__spinnerActiveIds.size === 0) {
                sp.classList.add('d-none');
            }
        };
        if (arguments.length === 0 || typeof mostrar === 'undefined') {
            const id = genId();
            return show(id, 'Cargando...');
        }
        if (typeof mostrar === 'string') {
            const id = genId();
            show(id, mostrar);
            if (duracionMs && typeof duracionMs === 'number')
                setTimeout(() => hideById(id), duracionMs);
            return id;
        }
        if (mostrar) {
            const id = genId();
            return show(id, param);
        } else {
            if (typeof param === 'string') {
                const id = param;
                if (duracionMs && typeof duracionMs === 'number')
                    setTimeout(() => hideById(id), duracionMs);
                else
                    hideById(id);
            } else if (typeof param === 'number') {
                const delay = param;
                setTimeout(() => {
                    if (window.__spinnerActiveIds.size === 0)
                        sp.classList.add('d-none');
                }, delay);
            } else {
                window.__spinnerActiveIds.clear();
                sp.classList.add('d-none');
            }
    }
    },
    init() {
        const mq = window.matchMedia('(min-width: 992px)');
        mq.addEventListener('change', () => {
            if (mq.matches) {
                // asegurar que el offcanvas esté oculto y estado desktop limpio
                const el = document.getElementById('appSidebar');
                if (el && el.classList.contains('show') && typeof bootstrap !== 'undefined') {
                    const oc = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
                    oc.hide();
                }
            } else {
                // al pasar a móvil, desactiva colapso mini para mostrar texto en el menú
                document.body.classList.remove('sidebar-collapsed');
                const footer = document.querySelector('.sidebar-footer');
                if (footer)
                    footer.classList.remove('d-none');
            }
        });

        this.setActiveMenuByPath(location.pathname);
        // Asegurar activo en carga inicial también por servidor
        document.querySelectorAll('.app-sidebar .nav-link').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === location.pathname);
        });

        // htmx: actualizar activo y asegurar que la columna ocupa 100%
        document.addEventListener('htmx:afterSwap', (e) => {
            if (e.detail && e.detail.target && e.detail.target.id === 'app-content') {
                const path = location.pathname;
                app.setActiveMenuByPath(path);
                app.setTitleAndDescFromContent();
                app.adjustOverflow();
                if (typeof window.iniciarInterfaz === 'function') {
                    try {
                        window.iniciarInterfaz();
                    } catch {
                    }
                }
                if (typeof window.iniciarInterfazCrearSolicitud === 'function') {
                    try {
                        window.iniciarInterfazCrearSolicitud();
                    } catch {
                    }
                }
                app.initSignatures();
            }
        });

        // Persistencia al hacer clic en nav links
        document.addEventListener('click', (ev) => {
            const link = ev.target.closest('.app-sidebar .nav-link');
            if (!link)
                return;
            const href = link.getAttribute('href') || '/';
            ev.preventDefault();
            app.navigate(href);
        });

        // Restaurar estado desde sessionStorage (pestaña)
        try {
            const collapsed = sessionStorage.getItem('sidebarCollapsed');
            if (collapsed === '1' && mq.matches) {
                document.body.classList.add('sidebar-collapsed');
                document.documentElement.classList.add('sidebar-collapsed');
                document.querySelectorAll('.menu-d-none').forEach(el => el.classList.add('d-none'));
                app.setToggleIcon(false);
            } else {
                document.documentElement.classList.remove('sidebar-collapsed');
                app.setToggleIcon(true);
            }

            // Estado del icono en móvil según última sesión
            const el = document.getElementById('appSidebar');
            if (el && typeof bootstrap !== 'undefined') {
                const oc = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
                el.addEventListener('shown.bs.offcanvas', () => {
                    app.setToggleIcon(true);
                    try {
                        sessionStorage.setItem('menuOpen', '1');
                    } catch {
                    }
                });
                el.addEventListener('hidden.bs.offcanvas', () => {
                    app.setToggleIcon(false);
                    try {
                        sessionStorage.setItem('menuOpen', '0');
                    } catch {
                    }
                });
                const menuOpen = sessionStorage.getItem('menuOpen');
                if (!mq.matches) {
                    if (menuOpen === '1') {
                        oc.show();
                        app.setToggleIcon(true);
                    } else {
                        oc.hide();
                        app.setToggleIcon(false);
                    }
                }
            }

            const savedPath = sessionStorage.getItem('activePath');
            if (!savedPath || savedPath !== location.pathname) {
                try {
                    sessionStorage.setItem('activePath', location.pathname);
                } catch {
                }
            }
        } catch {
        }
        // Inicializa título/subtítulo y overflow
        app.setTitleAndDescFromContent();
        app.adjustOverflow();
        app.initSignatures();
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button.icon-button');
            if (!btn)
                return;
            const action = btn.getAttribute('data-action');
            if (action === 'menu-toggle') {
                e.preventDefault();
                app.toggleSidebar();
                return;
            }
            if (action === 'settings') {
                e.preventDefault();
                app.userMenu.close();
                app.openSettings();
                return;
            }
            if (action === 'user-menu') {
                e.preventDefault();
                app.userMenu.open(btn);
                return;
            }
        });
        if (typeof window.iniciarInterfaz === 'function') {
            try {
                window.iniciarInterfaz();
            } catch {
            }
        }
        if (typeof window.iniciarInterfazCrearSolicitud === 'function') {
            try {
                window.iniciarInterfazCrearSolicitud();
            } catch {
            }
        }
        app.userMenu.close();
        window.addEventListener('resize', () => app.adjustOverflow());
    }
};

Object.assign(window, {
    modalApp: (title, html, footer) => app.modalApp(title, html, footer),
    ['modal-app']: (title, html, footer) => app.modalApp(title, html, footer),
    spinner: (...args) => app.spinner(...args),
});

window.addEventListener('DOMContentLoaded', () => app.init());


particlesJS("particles-js", {
    particles: {
        number: {value: 80},
        color: {value: "#bfc7d5"},
        shape: {type: "circle"},
        opacity: {value: 0.5},
        size: {value: 2},
        line_linked: {
            enable: true,
            distance: 150,
            color: "#cbd2e0",
            opacity: 0.4,
            width: 1
        },
        move: {enable: true, speed: 1}
    },
    interactivity: {
        events: {
            onhover: {enable: true, mode: "grab"}
        }
    },
    retina_detect: true
});


function crearItemDocumento() {
    $("[data-component='documento']").each(function () {
        const $el = $(this);
        const item = crearDocumento({
            id: $el.data("id"),
            icono: $el.data("icono"),
            titulo: $el.data("titulo"),
            subtitulo: $el.data("subtitulo"),
            htmlId: $el.data("id-html"),
            htmlClass: $el.data("class-html") // 👈 AQUÍ
        });
        $el.replaceWith(item);
    });
}

function crearDocumento( { id, icono, titulo, subtitulo, htmlId, htmlClass }) {
    const $item = $(`
        <div class="btn-toggle btn-toggle-cootras d-following doc-item mb-2 border-input cursor" data-id="${id}" title="${titulo}">
            <div class="row align-items-center g-0">
                <div class="col-auto">
                    <div class="icon-box d-flex align-items-center justify-content-center">
                        <i class="bi ${icono} f-25"></i>
                    </div>
                </div>
                <div class="col ps-3">
                    <div class="fw-semibold text-dark">${titulo}</div>
                    <div class="text-muted small">${subtitulo}</div>
                </div>
                <div class="col-auto">
                    <i class="bi bi-chevron-right text-secondary fs-5"></i>
                </div>
            </div>
        </div>
    `);
    htmlId && $item.attr("id", htmlId);
    htmlClass && $item.addClass(htmlClass);
    return $item;
}

// === Lógica Global del Spinner ===
// Mostrar spinner inmediatamente al cargar el script
if (typeof app !== 'undefined') {
    let id_ = app.spinner(true, "Cargando librerias...");
    if (window.location.pathname == "/") {
        spinner(false, id_);
    }
}

// Ocultar spinner cuando toda la página (imágenes, scripts, etc.) haya cargado
$(window).on('load', function () {
    setTimeout(() => {
        if (typeof app !== 'undefined') {
            app.spinner(false);
        } else {
            $('#spinner').addClass('d-none');
        }
    }, 500);
});
