'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import ProjectModalForm from '@/components/projects/ProjectModalForm'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function ProjectListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

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

  useEffect(() => { fetchProjects() }, [])

  const filteredProjects = projects.filter((project) => {
    const term = search.toLowerCase()
    return (
      project.name.toLowerCase().includes(term) ||
      project.projectCode?.toLowerCase().includes(term) ||
      project.address?.city?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Proyectos creados</h2>
        <div className="flex gap-2">
          <Button onClick={fetchProjects}>Recargar</Button>
          <Button onClick={() => setOpen(true)}>➕ Nuevo proyecto</Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, código o ciudad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        spellCheck={false}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <p>Cargando...</p>
        ) : filteredProjects.length === 0 ? (
          <p>No hay coincidencias.</p>
        ) : (
          <ul className="space-y-4">
            {filteredProjects.map((project) => (
              <li key={project._id} className=" rounded p-4 shadow-gray-300 shadow hover:bg-gray-50 transition-colors hover:scale-101">
                <Link href={`/projects/${project._id}`} className="block hover:underline">
                  <h3 className="text-lg font-semibold text-blue-800">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.projectCode} - {project.address?.city}</p>
                </Link>
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
