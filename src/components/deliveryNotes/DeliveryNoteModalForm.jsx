'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function DeliveryNoteModalForm({ isOpen, onClose, onDeliveryNoteCreated }) {
  const [form, setForm] = useState({
    clientId: '',
    projectId: '',
    format: 'hours',
    hours: '',
    material: '',
    description: '',
    workdate: ''
  })

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
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

  useEffect(() => {
    if (!form.clientId) return

    fetch(`https://bildy-rpmaya.koyeb.app/api/project/${form.clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [form.clientId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          hours: form.format === 'hours' ? Number(form.hours) : undefined,
          material: form.format === 'material' ? form.material : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || 'Error al crear el albarán')
        return
      }

      onClose()
      onDeliveryNoteCreated()

      setForm({
        clientId: '',
        projectId: '',
        format: 'hours',
        hours: '',
        material: '',
        description: '',
        workdate: ''
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
        <h2 className="text-xl font-bold text-gray-800">Crear nuevo albarán</h2>

        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2 text-sm font-medium text-gray-700">Cliente</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label className="col-span-2 text-sm font-medium text-gray-700">Proyecto</label>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            required
            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <label className="col-span-2 text-sm font-medium text-gray-700">Formato</label>
          <select
            name="format"
            value={form.format}
            onChange={handleChange}
            required
            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="hours">Horas</option>
            <option value="material">Material</option>
          </select>

          {form.format === 'hours' ? (
            <Input name="hours" label="Horas" value={form.hours} onChange={handleChange} required />
          ) : (
            <Input name="material" label="Material" value={form.material} onChange={handleChange} required />
          )}

          <Input name="description" label="Descripción" value={form.description} onChange={handleChange} required />
          <Input name="workdate" label="Fecha de trabajo" type="date" value={form.workdate} onChange={handleChange} required />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between pt-4">
          <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</Button>
          <Button type="submit">Crear Albarán</Button>
        </div>
      </form>
    </div>
  )
}
