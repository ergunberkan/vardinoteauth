'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setMessage('Şifre güncelleme başarısız oldu: ' + error.message)
      } else {
        setMessage('Şifreniz başarıyla güncellendi! Yönlendiriliyorsunuz...')
        setTimeout(() => {
          window.location.href = 'vardinote://login'
        }, 2000)
      }
    } catch (error) {
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const access_token = searchParams.get('access_token')
    if (access_token) {
      supabase.auth.setSession({ access_token, refresh_token: '' })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">VardiNote</h2>
          <h3 className="text-xl font-medium text-gray-900">Yeni Şifre Belirleme</h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Yeni Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </div>
          {message && (
            <p className="mt-2 text-sm text-center" style={{ color: message.includes('başarısız') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
} 