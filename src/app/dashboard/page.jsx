'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'

export default function DashboardPage() {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [notes, setNotes] = useState([])
  const [error, setError] = useState(null)

  const token = Cookies.get('jwt')

  useEffect(() => {
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch('https://bildy-rpmaya.koyeb.app/api/client', { headers }).then(r => r.json()),
      fetch('https://bildy-rpmaya.koyeb.app/api/project', { headers }).then(r => r.json()),
      fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', { headers }).then(r => r.json()),
    ])
      .then(([clients, projects, notes]) => {
        setClients(clients.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5))
        setProjects(projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5))
        setNotes(notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5))
      })
      .catch(() => setError('Error al cargar los datos'))
  }, [token])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Panel de Control</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Section title="Últimos Clientes" items={clients} linkBase="/clients" getLabel={c => c.name} />
      <Section title="Últimos Proyectos" items={projects} linkBase="/projects" getLabel={p => p.name} />
      <Section title="Últimos Albaranes" items={notes} linkBase="/delivery-notes" getLabel={n => n.description || 'Sin descripción'}
/>

    </div>
  )
}

function Section({ title, items, linkBase, getLabel }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
        {items.length === 0 && <p className="text-gray-500 text-sm">No hay datos recientes.</p>}
        {items.map(item => (
          <Link
            key={item._id}
            href={`${linkBase}/${item._id}`}
            className="block text-blue-700 hover:underline text-sm"
          >
            {getLabel(item)}
          </Link>
        ))}
      </div>
    </div>
  )
}
