import React from 'react';
import { Dialog } from '@headlessui/react';
import { Registration, useRegistrations } from '../../hooks/useRegistrations';

interface Props {
  eventId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const { registrations, loading } = useRegistrations(eventId ?? undefined);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 px-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Registrations</Dialog.Title>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : registrations.length === 0 ? (
            <p className="text-gray-500">No registrations found.</p>
          ) : (
            <ul className="space-y-2">
              {registrations.map((reg: Registration) => (
                <li key={reg.id} className="border p-3 rounded-md bg-gray-50">
                  <p><strong>Email:</strong> {reg.userEmail}</p>
                  <p><strong>Registered At:</strong> {new Date(reg.registeredAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
