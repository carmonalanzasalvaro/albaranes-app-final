import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100">
      <div className="hidden lg:flex flex-col items-center justify-center bg-white px-16">
        <img
          src="/images/Girl_Staring_At_Computer.png"
          alt="Login"
          className="w-[340px] mb-8 drop-shadow-xl"
        />
        <h2 className="text-4xl font-bold text-blue-800 mb-3">¡Hola de nuevo!</h2>
        <p className="text-blue-700 text-xl text-center max-w-sm">
          Accede y gestiona tus albaranes en segundos.
        </p>
      </div>

      <div className="flex items-center justify-center px-8">
        <LoginForm />
      </div>
    </div>
  )
}
