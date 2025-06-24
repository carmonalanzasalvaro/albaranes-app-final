
import ClientList from '@/components/clients/ClientList'

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Gestión de Clientes
      </h1>
      <ClientList />
    </div>
  )
}
