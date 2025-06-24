'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import ClientModalForm from './ClientModalForm'
import Button from '../ui/Button'

export default function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchClients = async () => {
    const token = Cookies.get('jwt')
    if (!token) return

    const res = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    if (res.ok) setClients(data)
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  const filteredClients = clients.filter((client) => {
    const term = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(term) ||
      client.cif?.toLowerCase().includes(term) ||
      client.address?.city?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Clientes registrados</h2>
        <div className="flex gap-2">
          <Button onClick={fetchClients}>Recargar</Button>
          <Button onClick={() => setOpen(true)}>➕ Nuevo cliente</Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, CIF o ciudad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        spellCheck={false}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p>Cargando...</p>
        ) : filteredClients.length === 0 ? (
          <p>No hay coincidencias.</p>
        ) : (
          <ul className="space-y-4">
            {filteredClients.map((client) => (
              <li key={client._id} className=" rounded p-4 shadow-gray-300 shadow hover:bg-gray-50 transition-colors hover:scale-101">
                <Link href={`/clients/${client._id}`} className="block hover:underline">
                  <h3 className="text-lg font-semibold text-blue-800">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.cif} · {client.address?.city}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ClientModalForm
        isOpen={open}
        onClose={() => setOpen(false)}
        onClientCreated={fetchClients}
      />
    </div>
  )
}
