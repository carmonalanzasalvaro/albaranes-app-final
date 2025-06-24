'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ProjectModalForm({ isOpen, onClose, onProjectCreated }) {
  const [form, setForm] = useState({
    name: '',
    projectCode: '',
    clientId: '',
    street: '',
    number: '',
    postal: '',
    city: '',
    province: ''
  })

  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)
  const token = Cookies.get('jwt')

  useEffect(() => {
    if (!isOpen || !token) return
    fetch('https://bildy-rpmaya.koyeb.app/api/client', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClients(data))
  }, [isOpen, token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const client = clients.find(c => c._id === form.clientId)
    if (!client) {
      setError('Cliente no válido')
      return
    }

    const safeName = client.name.toLowerCase().replace(/\s+/g, '-').slice(0, 10)
    const uniqueCode = `${safeName}-${Math.floor(Math.random() * 10000)}`

    const body = {
      name: form.name,
      projectCode: form.projectCode,
      email: Cookies.get('userEmail') || 'mail@mail.com',
      address: {
        street: form.street,
        number: Number(form.number),
        postal: Number(form.postal),
        city: form.city,
        province: form.province
      },
      code: uniqueCode,
      clientId: form.clientId
    }

    console.log('📦 Body enviado al POST /api/project:', body)

    try {
      const res = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || 'Error al crear el proyecto')
        return
      }

      onClose()
      onProjectCreated()
      setForm({
        name: '',
        projectCode: '',
        clientId: '',
        street: '',
        number: '',
        postal: '',
        city: '',
        province: ''
      })
    } catch {
      setError('Error de red o servidor')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xl space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">Crear nuevo proyecto</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input name="name" label="Nombre" value={form.name} onChange={handleChange} required />
          <Input name="projectCode" label="Código de Proyecto" value={form.projectCode} onChange={handleChange} required />

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Cliente</label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input name="street" label="Calle" value={form.street} onChange={handleChange} required />
          <Input name="number" label="Número" value={form.number} onChange={handleChange} required />
          <Input name="postal" label="Código Postal" value={form.postal} onChange={handleChange} required />
          <Input name="city" label="Ciudad" value={form.city} onChange={handleChange} required />
          <Input name="province" label="Provincia" value={form.province} onChange={handleChange} required />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between pt-4">
          <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
          <Button type="submit">Crear Proyecto</Button>
        </div>
      </form>
    </div>
  )
}
