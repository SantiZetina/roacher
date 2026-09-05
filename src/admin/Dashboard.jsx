import { useEffect, useRef, useState } from 'react'
import { categories } from '../data/categories.js'
import { supabase } from '../lib/supabase.js'
import { removeStoredPhoto, uploadPhoto } from './upload.js'

const inputClass =
  'block w-full border border-white/15 bg-coal px-3 py-2 text-sm text-paper outline-none focus:border-white/40'
const smallButtonClass =
  'border border-white/15 px-3 py-2 text-xs font-medium tracking-[0.15em] text-ash uppercase transition-colors hover:border-white/40 hover:text-paper disabled:opacity-40'

export default function Dashboard() {
  const [rows, setRows] = useState([])
  const [dirtyIds, setDirtyIds] = useState(new Set())
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const bySortOrder = (a, b) => a.sort_order - b.sort_order
  const wall = rows.filter((r) => r.slot === 'wall').sort(bySortOrder)
  const gallery = rows.filter((r) => r.slot === 'gallery').sort(bySortOrder)
  const about = rows.find((r) => r.slot === 'about')

  // One admin panel per section on the public page, in the same order.
  const known = new Set(categories.map((c) => c.id))
  const sections = categories.map((category) => ({
    key: category.id,
    heading: category.name,
    hint: `${category.blurb} El mosaico se llena en orden y se repite cada seis fotos: un cuadro grande, cuatro chicos y un panorama ancho — así que la 1, 7, 13… van en el cuadro grande y la 6, 12, 18… conviene que sean tomas anchas.`,
    rows: gallery.filter((r) => r.category === category.id),
  }))

  // Photos filed under a name no longer in categories.js still need somewhere
  // to be managed from, so they get a panel at the end (no upload button —
  // it's a place to re-file them, not to add more).
  const orphans = gallery.filter((r) => !known.has(r.category))
  if (orphans.length) {
    sections.push({
      key: '__otras',
      heading: 'Sin sección',
      hint: 'Estas fotos no tienen sección asignada. En el sitio aparecen al final, bajo “Otras”. Usa el menú para moverlas a una sección.',
      rows: orphans,
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    const { data, error } = await supabase.from('photos').select('*').order('sort_order')
    if (error) setStatus(`No se pudieron cargar las fotos: ${error.message}`)
    else setRows(data)
  }

  function editRow(id, fields) {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, ...fields } : r)))
    setDirtyIds((current) => new Set(current).add(id))
  }

  async function saveRow(row) {
    setBusy(true)
    const { error } = await supabase
      .from('photos')
      .update({ title: row.title, category: row.category })
      .eq('id', row.id)
    if (error) setStatus(`No se pudo guardar: ${error.message}`)
    else {
      setDirtyIds((current) => {
        const next = new Set(current)
        next.delete(row.id)
        return next
      })
      setStatus('Guardado.')
    }
    setBusy(false)
  }

  async function replaceSlotPhoto(slot, existingRow, file) {
    setBusy(true)
    setStatus(`Subiendo ${file.name}…`)
    try {
      const url = await uploadPhoto(file, slot)
      if (existingRow) {
        const { error } = await supabase.from('photos').update({ src: url }).eq('id', existingRow.id)
        if (error) throw error
        await removeStoredPhoto(existingRow.src)
      } else {
        const { error } = await supabase.from('photos').insert({ slot, src: url, title: '', category: '' })
        if (error) throw error
      }
      await refresh()
      setStatus('Foto actualizada. Ya está en vivo en el sitio.')
    } catch (error) {
      setStatus(`No se pudo subir: ${error.message}`)
    }
    setBusy(false)
  }

  // Adds photos to an ordered slot ('gallery' or 'wall'), appending at the end.
  // `category` files gallery uploads straight into a section, so Rodrigo picks
  // the section by which button he presses instead of tagging afterwards.
  // `orderBasis` is every row in the slot (not just the section's), so
  // sort_order stays unique across the whole gallery.
  async function addPhotos(slot, orderBasis, files, category = '') {
    setBusy(true)
    let nextOrder = orderBasis.length ? Math.max(...orderBasis.map((r) => r.sort_order)) + 1 : 0
    for (const file of files) {
      setStatus(`Subiendo ${file.name}…`)
      try {
        const url = await uploadPhoto(file, slot)
        const { error } = await supabase.from('photos').insert({
          slot,
          src: url,
          title: slot === 'gallery' ? file.name.replace(/\.[^.]+$/, '') : '',
          category,
          sort_order: nextOrder++,
        })
        if (error) throw error
      } catch (error) {
        setStatus(`Falló la subida de ${file.name}: ${error.message}`)
        setBusy(false)
        return
      }
    }
    await refresh()
    setStatus(slot === 'gallery' ? 'Fotos agregadas. Ponles título abajo.' : 'Fotos agregadas al muro.')
    setBusy(false)
  }

  async function movePhoto(list, index, direction) {
    const target = index + direction
    if (target < 0 || target >= list.length) return
    setBusy(true)
    const a = list[index]
    const b = list[target]
    const results = await Promise.all([
      supabase.from('photos').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('photos').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    const failed = results.find((r) => r.error)
    if (failed) setStatus(`No se pudo reordenar: ${failed.error.message}`)
    await refresh()
    setBusy(false)
  }

  async function deletePhoto(row) {
    if (!window.confirm(`¿Eliminar “${row.title || 'esta foto'}” del sitio?`)) return
    setBusy(true)
    const { error } = await supabase.from('photos').delete().eq('id', row.id)
    if (error) setStatus(`No se pudo eliminar: ${error.message}`)
    else {
      await removeStoredPhoto(row.src)
      setStatus('Foto eliminada.')
    }
    await refresh()
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-ink pb-24 font-sans text-paper">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl font-light italic">Fotos del sitio</h1>
          <div className="flex items-center gap-x-3">
            <a href="/" className={smallButtonClass}>
              Ver sitio
            </a>
            <button type="button" onClick={() => supabase.auth.signOut()} className={smallButtonClass}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {status && <p className="mt-6 border border-white/10 bg-coal px-4 py-3 text-sm text-ash">{status}</p>}

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Muro principal — parte superior</h2>
            <AddPhotosButton busy={busy} onFiles={(files) => addPhotos('wall', wall, files)} />
          </div>
          <p className="mt-2 text-sm text-ash">
            Estas llenan el muro de fotos detrás del título. Las fotos verticales se ven mejor. Funciona con
            cualquier cantidad — el muro las repite para llenarse — pero con 8 o más se ve más variado.
          </p>
          {wall.length === 0 && (
            <p className="mt-6 text-sm text-ash">
              Todavía no hay fotos — el sitio está mostrando sus imágenes de ejemplo. Agrega fotos para
              reemplazarlas.
            </p>
          )}
          <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {wall.map((row, index) => (
              <li key={row.id} className="border border-white/10 bg-coal/50 p-2">
                <img src={row.src} alt="" className="aspect-3/4 w-full bg-coal object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => movePhoto(wall, index, -1)}
                    className={smallButtonClass}
                  >
                    ←
                  </button>
                  <button type="button" disabled={busy} onClick={() => deletePhoto(row)} className={smallButtonClass}>
                    ✕
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === wall.length - 1}
                    onClick={() => movePhoto(wall, index, 1)}
                    className={smallButtonClass}
                  >
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <SlotCard
            label="Retrato de Sobre mí"
            hint="Tu foto en la sección Sobre mí. Se muestra a sangre completa detrás del texto, oscurecida del lado izquierdo."
            row={about}
            busy={busy}
            onReplace={(file) => replaceSlotPhoto('about', about, file)}
          />
        </div>

        {/* One panel per section, mirroring the public page. Rodrigo picks
            the section by which "Agregar fotos" button he presses, so an
            upload can't land uncategorised by accident. */}
        {sections.map((section) => (
          <section key={section.key} className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">
                {section.heading}
                <span className="ml-3 normal-case tracking-normal text-white/30">
                  {section.rows.length} {section.rows.length === 1 ? 'foto' : 'fotos'}
                </span>
              </h2>
              {section.key !== '__otras' && (
                <AddPhotosButton
                  busy={busy}
                  onFiles={(files) => addPhotos('gallery', gallery, files, section.key)}
                />
              )}
            </div>
            <p className="mt-2 text-sm text-ash">{section.hint}</p>

            {section.rows.length === 0 && (
              <p className="mt-6 border border-dashed border-white/15 px-4 py-6 text-sm text-ash">
                Todavía no hay fotos en esta sección. Mientras esté vacía, la sección no aparece en el sitio.
              </p>
            )}

            <ul className="mt-6 space-y-4">
              {section.rows.map((row, index) => (
                <li key={row.id} className="flex flex-wrap items-center gap-4 border border-white/10 bg-coal/50 p-4">
                  <span className="w-6 text-right font-display text-lg font-light text-ash italic">{index + 1}</span>
                  <img src={row.src} alt="" className="h-20 w-28 shrink-0 bg-coal object-cover" />
                  <div className="grid min-w-56 flex-1 gap-2">
                    <input
                      type="text"
                      placeholder="Título"
                      value={row.title}
                      onChange={(e) => editRow(row.id, { title: e.target.value })}
                      className={inputClass}
                    />
                    {/* A dropdown, not free text: the site groups photos by an
                        exact string match, so a typo would quietly file a photo
                        into a section that never appears. Doubles as the way to
                        move a photo from one section to another. */}
                    <select
                      value={row.category}
                      onChange={(e) => editRow(row.id, { category: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Sin sección</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          Mover a {category.name}
                        </option>
                      ))}
                      {/* Keeps a legacy value visible instead of silently
                          showing the wrong option when it isn't in the list. */}
                      {row.category && !categories.some((c) => c.id === row.category) && (
                        <option value={row.category}>{row.category} (sección antigua)</option>
                      )}
                    </select>
                  </div>
                  <div className="flex items-center gap-x-2">
                    {dirtyIds.has(row.id) && (
                      <button type="button" disabled={busy} onClick={() => saveRow(row)} className={smallButtonClass}>
                        Guardar
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy || index === 0}
                      onClick={() => movePhoto(section.rows, index, -1)}
                      className={smallButtonClass}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={busy || index === section.rows.length - 1}
                      onClick={() => movePhoto(section.rows, index, 1)}
                      className={smallButtonClass}
                    >
                      ↓
                    </button>
                    <button type="button" disabled={busy} onClick={() => deletePhoto(row)} className={smallButtonClass}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}

function SlotCard({ label, hint, row, busy, onReplace, children }) {
  const fileRef = useRef(null)

  return (
    <div className="border border-white/10 bg-coal/50 p-4">
      <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">{label}</h2>
      <p className="mt-2 text-sm text-ash">{hint}</p>
      <div className="mt-4 aspect-4/5 w-full max-w-52 bg-coal">
        {row ? (
          <img src={row.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ash">
            Usando la foto de ejemplo — sube una para reemplazarla
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onReplace(e.target.files[0])
          e.target.value = ''
        }}
      />
      <button type="button" disabled={busy} onClick={() => fileRef.current.click()} className={`mt-4 ${smallButtonClass}`}>
        {row ? 'Reemplazar foto' : 'Subir foto'}
      </button>
      {children}
    </div>
  )
}

function AddPhotosButton({ busy, onFiles }) {
  const fileRef = useRef(null)

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files.length) onFiles([...e.target.files])
          e.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current.click()}
        className="bg-paper px-5 py-2.5 text-xs font-medium tracking-[0.2em] text-ink uppercase transition-colors hover:bg-white disabled:opacity-50"
      >
        Agregar fotos
      </button>
    </>
  )
}
