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

  const bySortOrder = (a, b) => a.sort_order - b.sort_order
  const wall = rows.filter((r) => r.slot === 'wall').sort(bySortOrder)
  const gallery = rows.filter((r) => r.slot === 'gallery').sort(bySortOrder)
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
      .update({ title: row.title, category: row.category })
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
        const { error } = await supabase.from('photos').insert({ slot, src: url, title: '', category: '' })
        if (error) throw error
      }
      await refresh()
      setStatus('Photo updated. It is live on the site now.')
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`)
    }
    setBusy(false)
  }

  // Adds photos to an ordered slot ('gallery' or 'wall'), appending at the end.
  async function addPhotos(slot, list, files) {
    setBusy(true)
    let nextOrder = list.length ? Math.max(...list.map((r) => r.sort_order)) + 1 : 0
    for (const file of files) {
      setStatus(`Uploading ${file.name}…`)
      try {
        const url = await uploadPhoto(file, slot)
        const { error } = await supabase.from('photos').insert({
          slot,
          src: url,
          title: slot === 'gallery' ? file.name.replace(/\.[^.]+$/, '') : '',
          category: '',
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
    setStatus(slot === 'gallery' ? 'Photos added. Fill in their titles and categories below.' : 'Photos added to the wall.')
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

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Hero wall — top of the page</h2>
            <AddPhotosButton busy={busy} onFiles={(files) => addPhotos('wall', wall, files)} />
          </div>
          <p className="mt-2 text-sm text-ash">
            These fill the photo wall behind the headline. Tall (portrait) photos look best. Any number works — the
            wall repeats them to fill itself — but 8 or more gives the most variety.
          </p>
          {wall.length === 0 && (
            <p className="mt-6 text-sm text-ash">
              No photos yet — the site is showing its built-in placeholders. Add photos to replace them.
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
            label="About portrait"
            hint="The photo of you in the About section. It shows full-bleed behind the text, darkened on the left."
            row={about}
            busy={busy}
            onReplace={(file) => replaceSlotPhoto('about', about, file)}
          />
        </div>

        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Gallery — Selected work</h2>
            <AddPhotosButton busy={busy} onFiles={(files) => addPhotos('gallery', gallery, files)} />
          </div>
          <p className="mt-2 text-sm text-ash">
            The mosaic fills in order and repeats every six photos: one big square, four small squares, then a wide
            panorama. So photos 1, 7, 13… get the big frame and photos 6, 12, 18… should be wide shots. Use the arrows
            to reorder.
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
                  <input
                    type="text"
                    placeholder="Category, e.g. Portrait"
                    value={row.category}
                    onChange={(e) => editRow(row.id, { category: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-x-2">
                  {dirtyIds.has(row.id) && (
                    <button type="button" disabled={busy} onClick={() => saveRow(row)} className={smallButtonClass}>
                      Save
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => movePhoto(gallery, index, -1)}
                    className={smallButtonClass}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === gallery.length - 1}
                    onClick={() => movePhoto(gallery, index, 1)}
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
