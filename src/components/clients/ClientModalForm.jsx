'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Cookies from 'js-cookie'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ClientModalForm({ isOpen, onClose, onClientCreated }) {
  const [form, setForm] = useState({
    name: '',
    cif: '',
    street: '',
    number: '',
    postal: '',
    city: '',
    province: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      const res = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || 'Error al crear cliente')
        return
      }

      onClientCreated()
      onClose()
    } catch {
      setError('Error de red o servidor')
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all space-y-6">
                <Dialog.Title className="text-2xl font-bold text-gray-800">Nuevo cliente</Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
                    <Input label="CIF" name="cif" value={form.cif} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Calle" name="street" value={form.street} onChange={handleChange} required />
                    <Input label="Número" name="number" value={form.number} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Código Postal" name="postal" value={form.postal} onChange={handleChange} required />
                    <Input label="Ciudad" name="city" value={form.city} onChange={handleChange} required />
                  </div>

                  <Input label="Provincia" name="province" value={form.province} onChange={handleChange} required />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500">
                      Cancelar
                    </Button>
                    <Button type="submit">Crear cliente</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
