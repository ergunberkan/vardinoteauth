'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export default function EmailConfirmPage() {
  const [message, setMessage] = useState('E-posta doğrulanıyor...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') || '/'

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })

          if (error) {
            setMessage('E-posta doğrulama başarısız oldu. Lütfen tekrar deneyin.')
          } else {
            setMessage('E-posta başarıyla doğrulandı! Yönlendiriliyorsunuz...')
            setTimeout(() => {
              window.location.href = 'vardinote://' + next
            }, 2000)
          }
        }
      } catch (error) {
        setMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }

    confirmEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">VardiNote</h2>
          <p className="text-lg text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
} 