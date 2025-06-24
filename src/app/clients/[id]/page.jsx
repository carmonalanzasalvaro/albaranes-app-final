'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PencilIcon from '@/components/icons/PencilIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({})
  const [error, setError] = useState(null)

  const token = Cookies.get('jwt')

  const fetchClient = async () => {
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClient(data)
      setForm({
        name: data.name || '',
        cif: data.cif || '',
        street: data.address?.street || '',
        number: data.address?.number || '',
        postal: data.address?.postal || '',
        city: data.address?.city || '',
        province: data.address?.province || ''
      })
    } catch {
      setError('Error al cargar el cliente')
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProjects(data)
    } catch {
      console.error('Error al cargar los proyectos')
    }
  }

  useEffect(() => {
    fetchClient()
    fetchProjects()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    setError(null)
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          cif: form.cif,
          address: {
            street: form.street,
            number: Number(form.number),
            postal: Number(form.postal),
            city: form.city,
            province: form.province
          }
        })
      })

      if (!res.ok) throw new Error()
      setEditMode(false)
      fetchClient()
    } catch {
      setError('Error al actualizar el cliente')
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm('¿Seguro que deseas eliminar este cliente?')
    if (!confirmed) return

    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      window.location.href = '/clients'
    } catch {
      setError('No se pudo eliminar el cliente.')
    }
  }

  if (error) return <div className="text-red-600">{error}</div>
  if (!client) return <p className="text-gray-600">Cargando cliente...</p>

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Info del cliente */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800">{client.name}</h2>
          <div className="flex gap-4">
            <button onClick={() => setEditMode(!editMode)} title="Editar">
              <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
            </button>
            <button onClick={handleDelete} title="Eliminar">
              <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
            </button>
          </div>
        </div>

        {editMode ? (
          <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="Nombre" value={form.name} onChange={handleChange} required />
            <Input name="cif" label="CIF" value={form.cif} onChange={handleChange} required />
            <Input name="street" label="Calle" value={form.street} onChange={handleChange} required />
            <Input name="number" label="Número" value={form.number} onChange={handleChange} required />
            <Input name="postal" label="Código Postal" value={form.postal} onChange={handleChange} required />
            <Input name="city" label="Ciudad" value={form.city} onChange={handleChange} required />
            <Input name="province" label="Provincia" value={form.province} onChange={handleChange} required />
            <div className="col-span-2 flex justify-end">
              <Button onClick={handleUpdate}>Guardar cambios</Button>
            </div>
          </div>
        ) : (
          <div className="text-sm space-y-1">
            <p><strong>CIF:</strong> {client.cif}</p>
            <p><strong>Dirección:</strong> {client.address?.street}, {client.address?.number}</p>
            <p><strong>Ciudad:</strong> {client.address?.city} ({client.address?.postal})</p>
            <p><strong>Provincia:</strong> {client.address?.province}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Proyectos relacionados */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Proyectos relacionados</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">Este cliente no tiene proyectos asociados.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p._id} className=" rounded p-4 shadow-gray-300 shadow hover:bg-gray-50 transition-colors hover:scale-101">
                <Link href={`/projects/${p._id}`} className="block hover:underline">
                  <span className="text-blue-700 font-medium">{p.name}</span>
                  <p className="text-sm text-gray-600">{p.projectCode} · {p.address?.city}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
