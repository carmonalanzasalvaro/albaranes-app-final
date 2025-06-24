'use client'

import EditableDeliveryNote from './EditableDeliveryNote'

export default function DeliveryNoteList({ deliveryNotes, onRefresh }) {
  if (!deliveryNotes || deliveryNotes.length === 0) {
    return <p className="text-gray-500 mt-6">No hay albaranes disponibles.</p>
  }

  return (
    <div className="space-y-4 mt-6">
      {deliveryNotes.map((note) => (
        <EditableDeliveryNote
          key={note._id}
          note={note}
          onUpdated={onRefresh}
        />
      ))}
    </div>
  )
}

