import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

export default function ToastNotification({ type = 'success', message, onClose }) {
  if (!message) return null;
  
  const isSuccess = type === 'success';
  
  return (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 rounded shadow-lg text-white ${isSuccess ? 'bg-green-600' : 'bg-red-600'} z-50`}>
      {isSuccess ? <CheckCircle className="mr-2" size={20} /> : <XCircle className="mr-2" size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none hover:text-gray-200">
        <XCircle size={16} />
      </button>
    </div>
  );
}