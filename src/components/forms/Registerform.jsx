'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || 'Error en el registro')
        return
      }

      Cookies.set('jwt', data.token, { path: '/' })
      Cookies.set('pendingVerification', 'true', { path: '/' }) // ✅ Nueva cookie
      router.push('/validate')
    } catch {
      setError('Error de red o servidor')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg space-y-7"
    >
      <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>

      <Input className="text-lg px-4 py-3" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <div className="relative">
        <Input
          className="text-lg px-4 py-3"
          label="Contraseña"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          onClick={() => setShow(!show)}
          className="absolute right-4 top-9 text-sm cursor-pointer text-blue-600 select-none"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit">Registrarse</Button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a>
      </p>
    </form>
  )
}
