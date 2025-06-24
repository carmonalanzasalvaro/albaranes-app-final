'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import PencilIcon from '@/components/icons/PencilIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import Button from '../ui/Button'

export default function EditableClient({ client, onUpdated }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState({})
  const [form, setForm] = useState({
    name: client.name,
    cif: client.cif,
    street: client.address?.street || '',
    number: String(client.address?.number || ''),
    postal: String(client.address?.postal || ''),
    city: client.address?.city || '',
    province: client.address?.province || ''
  })
  const [error, setError] = useState(null)
  const [changed, setChanged] = useState(false)

  const handleFieldEdit = (field) => {
    setEditing({ ...editing, [field]: true })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setChanged(true)
  }

  const handleSave = async () => {
    const token = Cookies.get('jwt')
    if (!token) return

    const payload = {
      name: form.name,
      cif: form.cif,
      address: {
        street: form.street,
        number: Number(form.number),
        postal: Number(form.postal),
        city: form.city,
        province: form.province
      }
    }

    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || 'Error al actualizar')
        return
      }

      setEditing({})
      setChanged(false)
      setError(null)
      onUpdated()
    } catch {
      setError('Error de red o servidor')
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm(`¿Eliminar cliente "${client.name}"?`)
    if (!confirmDelete) return

    const token = Cookies.get('jwt')
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${client._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.ok) {
        onUpdated()
      } else {
        setError('Error al eliminar cliente')
      }
    } catch {
      setError('Error de red o servidor')
    }
  }

  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'cif', label: 'CIF' },
    { key: 'street', label: 'Street' },
    { key: 'number', label: 'Number' },
    { key: 'postal', label: 'Postal' },
    { key: 'city', label: 'City' },
    { key: 'province', label: 'Province' }
  ]

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-100">
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer text-xl font-bold text-blue-900 hover:underline mb-4 flex items-center justify-between"
      >
        {form.name}
        {expanded && (
          <div className="flex gap-3 items-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleDelete} className="p-1 hover:bg-red-50 rounded">
              <TrashIcon className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="flex items-start justify-between py-1 border-b border-dashed border-gray-200">
              <div className="w-1/3 text-gray-500 font-medium">{label}</div>
              <div className="w-2/3 flex justify-between items-center">
                {editing[key] ? (
                  <input
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="border border-gray-300 px-3 py-1 rounded-md w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <div className="text-gray-800 w-full">{form[key]}</div>
                )}
                <button onClick={() => handleFieldEdit(key)} className="ml-3 p-1 hover:bg-blue-50 rounded">
                  <PencilIcon className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {changed && (
            <div className="pt-4 text-right">
              <Button onClick={handleSave}>Guardar cambios</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
