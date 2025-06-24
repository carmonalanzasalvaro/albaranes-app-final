'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useState } from 'react'

import MenuIcon from '@/components/icons/MenuIcon'
import HomeIcon from '@/components/icons/HomeIcon'
import ClientsIcon from '@/components/icons/ClientsIcon'
import ProjectsIcon from '@/components/icons/ProjectsIcon'
import ReceiptIcon from '@/components/icons/ReceiptIcon'

export default function Sidebar({ collapsed, setCollapsed }){
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: 'Resumen', href: '/dashboard', icon: HomeIcon },
    { label: 'Clientes', href: '/clients', icon: ClientsIcon },
    { label: 'Proyectos', href: '/projects', icon: ProjectsIcon },
    { label: 'Albaranes', href: '/delivery-notes', icon: ReceiptIcon }
  ]

  const logout = () => {
    Cookies.remove('jwt')
    router.push('/login')
  }

  const handleMouseEnter = () => setCollapsed(false)
  const handleMouseLeave = () => setCollapsed(true)
  const handleClick = () => setCollapsed(true)

  return (
    <aside
      onMouseLeave={handleMouseLeave}
      className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-white border-r shadow fixed left-0 top-0 flex flex-col justify-between transition-all duration-300 z-50`}
    >
      {/* Botón Menú */}
      <div
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        className={`p-4 ${collapsed ? 'flex justify-center' : 'flex items-center'} cursor-pointer`}
      >
        <MenuIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
      </div>

      {/* Navegación */}
      <div className={`flex-1 px-2 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <nav className="w-full space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleClick}
              className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                pathname.startsWith(href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Cerrar sesión */}
      {!collapsed && (
        <div className="p-4">
          <button
            onClick={() => {
              handleClick()
              logout()
            }}
            className="flex items-center gap-2 text-sm text-red-500 hover:underline"
          >
            <span className="text-xl">⎋</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
