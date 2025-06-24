'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import ProjectModalForm from './ProjectModalForm'
import Button from '../ui/Button'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchProjects = async () => {
    const token = Cookies.get('jwt')
    if (!token) return

    const res = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    if (res.ok) setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Proyectos</h2>
        <div className="flex gap-2">
          <Button onClick={fetchProjects}>Recargar</Button>
          <Button onClick={() => setOpen(true)}>➕ Nuevo proyecto</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p>Cargando...</p>
        ) : projects.length === 0 ? (
          <p>No hay proyectos aún.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => (
              <li
                key={p._id}
                className="border-b py-3 text-gray-800 flex justify-between"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-500">{p.projectCode}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProjectModalForm
        isOpen={open}
        onClose={() => setOpen(false)}
        onProjectCreated={fetchProjects}
      />
    </div>
  )
}
