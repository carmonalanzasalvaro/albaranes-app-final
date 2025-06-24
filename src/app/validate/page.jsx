'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import ValidateForm from '@/components/forms/ValidateForm'

export default function ValidatePage() {
  useEffect(() => {
    Cookies.remove('pendingVerification')
  }, [])

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100">
      <div className="hidden lg:flex flex-col items-center justify-center bg-white px-16">
        <img
          src="/images/Girl_Staring_At_Computer.png"
          alt="Verificación"
          className="w-[340px] mb-8 drop-shadow-xl"
        />
        <h2 className="text-4xl font-bold text-blue-800 mb-3">¡Casi estás dentro!</h2>
        <p className="text-blue-700 text-xl text-center max-w-sm">
          Solo tienes que validar tu cuenta.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-8 space-y-6">
        <ValidateForm />
      </div>
    </div>
  )
}
