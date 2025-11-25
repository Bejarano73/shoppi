/**
 * DataList: librería global para renderizar listas con paginación, búsqueda y estado persistente
 * Uso:
 * DataList.mount({
 *   container: '#drivers-list',
 *   endpoint: '/api/conductores',
 *   storageKey: 'conductores',
 *   pageSize: 10,
 *   renderItem: (it) => htmlString
 * })
 */
(function(){
  const qs = (sel, root=document)=>root.querySelector(sel)
  const qsa = (sel, root=document)=>Array.from(root.querySelectorAll(sel))

  function fmtKm(n){return Intl.NumberFormat('es-CO').format(n)+' km'}
  function badgeEstado(e){
    const ok = (e||'').toLowerCase()==='activo'
    return `<span class="badge ${ok?'bg-success-subtle text-success':'bg-secondary-subtle text-secondary'}">${e||'N/A'}</span>`
  }

  async function fetchPage(cfg, state){
    const url = new URL(cfg.endpoint, location.origin)
    url.searchParams.set('q', state.q||'')
    if (state.estado) url.searchParams.set('estado', state.estado)
    url.searchParams.set('page', state.page)
    url.searchParams.set('size', cfg.pageSize)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Error al obtener datos')
    return res.json()
  }

  function persist(cfg, state){
    try{sessionStorage.setItem(`dl:${cfg.storageKey}`, JSON.stringify(state))}catch{}
  }
  function restore(cfg){
    try{
      const raw = sessionStorage.getItem(`dl:${cfg.storageKey}`)
      if (raw) return JSON.parse(raw)
    }catch{}
    return { q:'', estado:'', page:1 }
  }

  async function mount(cfg){
    const root = qs(cfg.container)
    if (!root) return
    root.innerHTML = `
      <div class="d-flex align-items-center gap-2 mb-3">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" id="dl-q" placeholder="Buscar por nombre, email o teléfono...">
        </div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <select class="form-select form-select-sm w-auto" id="dl-estado">
            <option value="">Todos los Estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      <div id="dl-list" class="d-flex flex-column gap-3"></div>
      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="dl-info"></div>
        <div class="btn-group">
          <button class="btn btn-outline-secondary btn-sm" id="dl-prev">Anterior</button>
          <button class="btn btn-outline-secondary btn-sm" id="dl-next">Siguiente</button>
        </div>
      </div>
    `
    const state = restore(cfg)
    qs('#dl-q', root).value = state.q||''
    qs('#dl-estado', root).value = state.estado||''

    async function load(){
      try{
        const data = await fetchPage(cfg, state)
        const listEl = qs('#dl-list', root)
        if (!data.items || data.items.length===0){
          listEl.innerHTML = `<div class="alert alert-light border text-center">No se encontraron resultados</div>`
        } else {
          listEl.innerHTML = data.items.map(it=>cfg.renderItem(it)).join('')
        }
        qs('#dl-info', root).textContent = `Página ${data.page} de ${data.pages} — ${data.total} registros`
        qs('#dl-prev', root).disabled = data.page<=1
        qs('#dl-next', root).disabled = data.page>=data.pages
        persist(cfg, state)
      }catch(e){
        qs('#dl-list', root).innerHTML = `<div class="alert alert-danger">${e.message}</div>`
      }
    }

    qs('#dl-q', root).addEventListener('input', (ev)=>{ state.q = ev.target.value.trim(); state.page=1; load() })
    qs('#dl-estado', root).addEventListener('change', (ev)=>{ state.estado = ev.target.value; state.page=1; load() })
    qs('#dl-prev', root).addEventListener('click', ()=>{ if(state.page>1){ state.page--; load() } })
    qs('#dl-next', root).addEventListener('click', ()=>{ state.page++; load() })

    load()
  }

  const DataList = { mount, fmtKm, badgeEstado }
  window.DataList = DataList
})();

