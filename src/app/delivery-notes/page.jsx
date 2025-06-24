'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import DeliveryNoteModalForm from '@/components/deliveryNotes/DeliveryNoteModalForm'

export default function DeliveryNoteListPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const token = Cookies.get('jwt')

  const fetchNotes = async () => {
    const res = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    if (res.ok) setNotes(data)
    setLoading(false)
  }

  useEffect(() => { fetchNotes() }, [])

  const filteredNotes = notes.filter(note => {
    const term = search.toLowerCase()
    return (
      note.description?.toLowerCase().includes(term) ||
      note.format?.toLowerCase().includes(term) ||
      note.workdate?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Albaranes creados</h2>
        <div className="flex gap-2">
          <Button onClick={fetchNotes}>Recargar</Button>
          <Button onClick={() => setOpen(true)}>➕ Nuevo albarán</Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por descripción, formato o fecha..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        spellCheck={false}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p>Cargando...</p>
        ) : filteredNotes.length === 0 ? (
          <p>No hay coincidencias.</p>
        ) : (
          <ul className="space-y-4">
            {filteredNotes.map((note) => (
              <li
                key={note._id}
                className="rounded p-4 shadow-gray-300 shadow hover:bg-gray-50 transition-colors hover:scale-101"
              >
                <Link href={`/delivery-notes/${note._id}`} className="block hover:underline">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Albarán {note.format === 'hours' ? `· ${note.hours}h` : `· ${note.material}`}
                  </h3>
                  <p className="text-sm text-gray-600">{note.description} · {note.workdate}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DeliveryNoteModalForm
        isOpen={open}
        onClose={() => setOpen(false)}
        onDeliveryNoteCreated={fetchNotes}
      />
    </div>
  )
}
