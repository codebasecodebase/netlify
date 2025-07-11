'use client';
import { useState } from 'react';

export default function TestEmail() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendTestEmail = async () => {
    setLoading(true);
    setStatus('Отправка...');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST'
      });
      
      const result = await response.json();
      setStatus(result.status === 'success' 
        ? `Успех: ${result.message}` 
        : `Ошибка: ${result.message}`);
    } catch (error) {
      setStatus('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Тест SMTP</h1>
        
        <button
          onClick={sendTestEmail}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Отправить тестовое письмо'}
        </button>
        
        {status && (
          <div className={`mt-4 p-3 rounded-md ${
            status.includes('Успех') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Проверьте:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Входящие письма (включая спам)</li>
            <li>Консоль сервера на ошибки</li>
            <li>Параметры SMTP в коде API</li>
          </ul>
        </div>
      </div>
    </div>
  );
}