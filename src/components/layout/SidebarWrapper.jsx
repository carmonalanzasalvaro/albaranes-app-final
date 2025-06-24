'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Sidebar from './Sidebar'

export default function SidebarWrapper({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)

  const hideSidebar = ['/login', '/register', '/validate'].includes(pathname)

  return (
    <>
      {!hideSidebar && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <main className={`${!hideSidebar ? (collapsed ? 'ml-20' : 'ml-64') : 'ml-0'} transition-all duration-300 p-6 min-h-screen`}>
        {children}
      </main>
    </>
  )
}
