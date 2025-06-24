'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import TrashIcon from '../icons/TrashIcon'
import FileDownIcon from '../icons/FileDownIcon'


export default function EditableDeliveryNote({ note, onUpdated }) {
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState(null)
  const token = Cookies.get('jwt')

  const handleDelete = async () => {
    const confirmed = confirm('¿Seguro que deseas eliminar este albarán?')
    if (!confirmed) return

    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${note._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Error al eliminar el albarán')
      onUpdated()
    } catch {
      setError('No se pudo eliminar el albarán.')
    }
  }

  const handleDownload = async () => {
    setError(null)

    if (!token) {
      setError('Token no encontrado. Inicia sesión de nuevo.')
      return
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${note._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Error al generar el PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `albaran_${note._id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('No se pudo descargar el PDF.')
    }
  }

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-lg font-semibold">Albarán: {note.code || 'Sin código'}</h3>
          <p className="text-sm text-gray-600">{note.description}</p>
        </div>
        <span className="text-blue-600 text-sm">{expanded ? 'Ocultar' : 'Ver más'}</span>
      </div>

      {expanded && (
        <div className="mt-4 space-y-1 text-sm">
          <p><strong>Proyecto:</strong> {note.project?.name || note.projectName || note.projectId?.name || note.projectId?.toString()}</p>
          <p><strong>Cliente:</strong> {note.client?.name || note.clientName || note.clientId?.name || note.clientId?.toString()}</p>
          <p><strong>Formato:</strong> {note.format}</p>
          {note.format === 'material' && (
            <p><strong>Material:</strong> {note.material}</p>
          )}
          {note.format === 'hours' && (
            <p><strong>Horas:</strong> {note.hours}</p>
          )}
          <p><strong>Fecha de trabajo:</strong> {note.workdate}</p>
          <p><strong>Pendiente:</strong> {note.pending ? 'Sí' : 'No'}</p>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-4 mt-3">
            <button onClick={handleDownload} title="Descargar PDF" className="text-blue-600 hover:text-blue-800">
              <FileDownIcon />
            </button>
            <button onClick={handleDelete} title="Eliminar" className="text-red-600 hover:text-red-800">
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
