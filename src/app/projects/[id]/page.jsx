'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Link from 'next/link'
import TrashIcon from '@/components/icons/TrashIcon'
import Button from '@/components/ui/Button'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [clientName, setClientName] = useState('')
  const [error, setError] = useState(null)

  const token = Cookies.get('jwt')

  useEffect(() => {
    if (!token) return setError('No autorizado')

    fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProject(data)
        return fetch(`https://bildy-rpmaya.koyeb.app/api/client/${data.clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      })
      .then(res => res.json())
      .then(client => setClientName(client.name))
      .catch(() => setError('Error al cargar el proyecto o cliente'))
  }, [id])

  const handleDelete = async () => {
    const confirmed = confirm('¿Seguro que deseas eliminar este proyecto?')
    if (!confirmed) return

    try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Error al eliminar el proyecto')

      router.push('/projects')
    } catch {
      setError('No se pudo eliminar el proyecto.')
    }
  }

  if (error) return <div className="text-red-600">{error}</div>
  if (!project) return <p className="text-gray-600">Cargando proyecto...</p>

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">{project.name}</h2>
            <p className="text-sm text-gray-500">{project.projectCode}</p>
          </div>
          <button
            onClick={handleDelete}
            title="Eliminar proyecto"
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <p><strong>Código interno:</strong> {project.code}</p>
        <p>
          <strong>Cliente:</strong>{' '}
          <Link href={`/clients/${project.clientId}`} className="text-blue-600 hover:underline">
            {clientName || '—'}
          </Link>
        </p>

        <div className="pt-4">
          <p className="font-medium">Dirección:</p>
          <p>{project.address?.street}, {project.address?.number}</p>
          <p>{project.address?.postal}, {project.address?.city}, {project.address?.province}</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}
