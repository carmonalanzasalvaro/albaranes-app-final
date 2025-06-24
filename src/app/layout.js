import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SidebarWrapper from '@/components/layout/SidebarWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Albaranes App',
  description: 'Gestión de albaranes y clientes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  )
}
