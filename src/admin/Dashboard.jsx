import { useEffect, useRef, useState } from 'react'
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

  const gallery = rows.filter((r) => r.slot === 'gallery').sort((a, b) => a.sort_order - b.sort_order)
  const hero = rows.find((r) => r.slot === 'hero')
  const about = rows.find((r) => r.slot === 'about')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    const { data, error } = await supabase.from('photos').select('*').order('sort_order')
    if (error) setStatus(`Could not load photos: ${error.message}`)
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
      .update({ title: row.title, category: row.category, span: row.span })
      .eq('id', row.id)
    if (error) setStatus(`Save failed: ${error.message}`)
    else {
      setDirtyIds((current) => {
        const next = new Set(current)
        next.delete(row.id)
        return next
      })
      setStatus('Saved.')
    }
    setBusy(false)
  }

  async function replaceSlotPhoto(slot, existingRow, file) {
    setBusy(true)
    setStatus(`Uploading ${file.name}…`)
    try {
      const url = await uploadPhoto(file, slot)
      if (existingRow) {
        const { error } = await supabase.from('photos').update({ src: url }).eq('id', existingRow.id)
        if (error) throw error
        await removeStoredPhoto(existingRow.src)
      } else {
        const { error } = await supabase.from('photos').insert({ slot, src: url, title: '', category: '', span: 'narrow' })
        if (error) throw error
      }
      await refresh()
      setStatus('Photo updated. It is live on the site now.')
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`)
    }
    setBusy(false)
  }

  async function addGalleryPhotos(files) {
    setBusy(true)
    let nextOrder = gallery.length ? Math.max(...gallery.map((r) => r.sort_order)) + 1 : 0
    for (const file of files) {
      setStatus(`Uploading ${file.name}…`)
      try {
        const url = await uploadPhoto(file, 'gallery')
        const { error } = await supabase.from('photos').insert({
          slot: 'gallery',
          src: url,
          title: file.name.replace(/\.[^.]+$/, ''),
          category: '',
          span: 'narrow',
          sort_order: nextOrder++,
        })
        if (error) throw error
      } catch (error) {
        setStatus(`Upload of ${file.name} failed: ${error.message}`)
        setBusy(false)
        return
      }
    }
    await refresh()
    setStatus('Photos added. Fill in their titles and categories below.')
    setBusy(false)
  }

  async function movePhoto(index, direction) {
    const target = index + direction
    if (target < 0 || target >= gallery.length) return
    setBusy(true)
    const a = gallery[index]
    const b = gallery[target]
    const results = await Promise.all([
      supabase.from('photos').update({ sort_order: target }).eq('id', a.id),
      supabase.from('photos').update({ sort_order: index }).eq('id', b.id),
    ])
    const failed = results.find((r) => r.error)
    if (failed) setStatus(`Reorder failed: ${failed.error.message}`)
    await refresh()
    setBusy(false)
  }

  async function deletePhoto(row) {
    if (!window.confirm(`Delete “${row.title || 'this photo'}” from the site?`)) return
    setBusy(true)
    const { error } = await supabase.from('photos').delete().eq('id', row.id)
    if (error) setStatus(`Delete failed: ${error.message}`)
    else {
      await removeStoredPhoto(row.src)
      setStatus('Photo deleted.')
    }
    await refresh()
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-ink pb-24 font-sans text-paper">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl font-light italic">Site photos</h1>
          <div className="flex items-center gap-x-3">
            <a href="/" className={smallButtonClass}>
              View site
            </a>
            <button type="button" onClick={() => supabase.auth.signOut()} className={smallButtonClass}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {status && <p className="mt-6 border border-white/10 bg-coal px-4 py-3 text-sm text-ash">{status}</p>}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <SlotCard
            label="Hero portrait"
            hint="The big photo at the top of the page. Portrait orientation works best."
            row={hero}
            busy={busy}
            onReplace={(file) => replaceSlotPhoto('hero', hero, file)}
          >
            {hero && (
              <div className="mt-3 flex gap-x-2">
                <input
                  type="text"
                  placeholder="Caption, e.g. Portrait in natural light"
                  value={hero.title}
                  onChange={(e) => editRow(hero.id, { title: e.target.value })}
                  className={inputClass}
                />
                {dirtyIds.has(hero.id) && (
                  <button type="button" disabled={busy} onClick={() => saveRow(hero)} className={smallButtonClass}>
                    Save
                  </button>
                )}
              </div>
            )}
          </SlotCard>
          <SlotCard
            label="About portrait"
            hint="The photo of you in the About section."
            row={about}
            busy={busy}
            onReplace={(file) => replaceSlotPhoto('about', about, file)}
          />
        </div>

        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Gallery — Selected work</h2>
            <AddPhotosButton busy={busy} onFiles={addGalleryPhotos} />
          </div>
          <p className="mt-2 text-sm text-ash">
            The first photo is the big panorama frame — a wide photo looks best there. Use the arrows to reorder.
          </p>
          {gallery.length === 0 && (
            <p className="mt-8 text-sm text-ash">
              No photos yet — the site is showing its built-in placeholders. Add photos to replace them.
            </p>
          )}
          <ul className="mt-6 space-y-4">
            {gallery.map((row, index) => (
              <li key={row.id} className="flex flex-wrap items-center gap-4 border border-white/10 bg-coal/50 p-4">
                <span className="w-6 text-right font-display text-lg font-light text-ash italic">{index + 1}</span>
                <img src={row.src} alt="" className="h-20 w-28 shrink-0 bg-coal object-cover" />
                <div className="grid min-w-56 flex-1 gap-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={row.title}
                    onChange={(e) => editRow(row.id, { title: e.target.value })}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Category, e.g. Portrait"
                      value={row.category}
                      onChange={(e) => editRow(row.id, { category: e.target.value })}
                      className={inputClass}
                    />
                    <select
                      value={row.span}
                      onChange={(e) => editRow(row.id, { span: e.target.value })}
                      className="border border-white/15 bg-coal px-2 py-2 text-sm text-paper outline-none focus:border-white/40"
                    >
                      <option value="narrow">Narrow</option>
                      <option value="wide">Wide</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  {dirtyIds.has(row.id) && (
                    <button type="button" disabled={busy} onClick={() => saveRow(row)} className={smallButtonClass}>
                      Save
                    </button>
                  )}
                  <button type="button" disabled={busy || index === 0} onClick={() => movePhoto(index, -1)} className={smallButtonClass}>
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === gallery.length - 1}
                    onClick={() => movePhoto(index, 1)}
                    className={smallButtonClass}
                  >
                    ↓
                  </button>
                  <button type="button" disabled={busy} onClick={() => deletePhoto(row)} className={smallButtonClass}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
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
            Using the built-in photo — upload to replace it
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
        {row ? 'Replace photo' : 'Upload photo'}
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
        Add photos
      </button>
    </>
  )
}
