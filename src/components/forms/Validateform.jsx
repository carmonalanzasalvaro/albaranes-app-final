'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ValidateForm() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const token = Cookies.get('jwt')

    if (!token) {
      setError('Sesión no válida. Vuelve a iniciar sesión.')
      router.push('/login')
      return
    }

    try {
      const res = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.message || 'Código incorrecto')
        return
      }

      Cookies.remove('pendingVerification')
      router.push('/clients')
    } catch {
      setError('Error de red o servidor')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg space-y-7"
    >
      <h2 className="text-3xl font-bold text-gray-800">Valida tu cuenta</h2>

      <p className="text-gray-600">Revisa tu correo y escribe aquí el código de verificación:</p>

      <Input
        name="code"
        label="Código de verificación"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit">Validar</Button>
    </form>
  )
}
