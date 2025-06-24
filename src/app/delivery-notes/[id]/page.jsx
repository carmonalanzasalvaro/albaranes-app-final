'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import DownloadIcon from '@/components/icons/FileDownIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default function DeliveryNoteDetailPage() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const token = Cookies.get('jwt')

  const fetchData = async () => {
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setNote(data)

      const resProj = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${data.projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const project = await resProj.json()
      setProjectName(project.name)

      const resClient = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${data.clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const client = await resClient.json()
      setClientName(client.name)
    } catch {
      setError('Error al cargar el albarán, cliente o proyecto.')
    }
  }

  useEffect(() => { fetchData() }, [id, token])

  const handleDownload = async () => {
    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `albaran_${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo descargar el PDF')
    }
  }

  const handleDelete = async () => {
    if (!note?.sign) {
      const confirmed = confirm('¿Seguro que deseas eliminar este albarán?')
      if (!confirmed) return

      try {
        const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        window.location.href = '/delivery-notes'
      } catch {
        alert('No se pudo eliminar el albarán')
      }
    }
  }

 const handleUpload = async (e) => {
  e.preventDefault()
  const file = fileInputRef.current?.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const uploadRes = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/signimage/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (!uploadRes.ok) throw new Error('Error al subir imagen')

    const { url } = await uploadRes.json()

    const saveRes = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/sign/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sign: url }),
    })

    

    alert('Firma registrada correctamente.')
    
    await fetchData()
  } catch {
    alert('No se pudo completar la firma.')
  }
}

  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!note) return <p className="p-6">Cargando albarán...</p>

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-blue-800">Albarán</h1>
          <div className="flex gap-4">
            <button onClick={handleDownload} title="Descargar PDF">
              <DownloadIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
            </button>
            {note.sign ? (
              <div title="No se puede eliminar un albarán autorizado">
                <TrashIcon className="w-5 h-5 text-gray-400 cursor-not-allowed" />
              </div>
            ) : (
              <button onClick={handleDelete} title="Eliminar">
                <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Descripción:</strong> {note.description}</p>
          <p><strong>Formato:</strong> {note.format}</p>
          {note.format === 'material' && <p><strong>Material:</strong> {note.material}</p>}
          {note.format === 'hours' && <p><strong>Horas:</strong> {note.hours}</p>}
          <p><strong>Fecha de trabajo:</strong> {note.workdate}</p>
          <p><strong>Pendiente:</strong> {note.pending ? 'Sí' : 'No'}</p>
          <p><strong>Proyecto:</strong> {note.projectName || '—'}</p>
          <p><strong>Cliente:</strong> {note.client?.name || '—'}</p>
          <p>
            <strong>Estado:</strong>{' '}
            {note.sign ? (
              <span className="text-green-600 font-semibold">Autorizado</span>
            ) : (
              <span className="text-yellow-500 font-semibold">Sin autorizar</span>
            )}
          </p>
        </div>

        {!note.sign && (
          <form onSubmit={handleUpload} className="mt-6 space-y-2">
            <input ref={fileInputRef} type="file" name="firma" accept="image/*" className="hidden" required />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
            >
              Elegir imagen de firma
            </button>
            <button
              type="submit"
              className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Subir firma
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
