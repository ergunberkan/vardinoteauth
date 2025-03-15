'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// Sayfayı client-side olarak işaretle
export const dynamic = 'force-dynamic';

// Ana component
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmEmail />
    </Suspense>
  );
}

// Yükleme durumu için fallback component
function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">VN</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">VardiNote</h2>
          <p className="mt-2 text-sm text-gray-600">E-posta Doğrulama</p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-gray-600">Sayfa yükleniyor...</p>
      </div>
    </div>
  );
}

// E-posta doğrulama mantığı için ana component
function ConfirmEmail() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('E-posta adresiniz doğrulanıyor...');

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setMessage('Geçersiz doğrulama bağlantısı. Lütfen tam URL\'yi kopyalayıp yapıştırdığınızdan emin olun.');
      return;
    }

    // Supabase'in tanımlı olup olmadığını kontrol et
    if (!supabase) {
      setStatus('error');
      setMessage('Sistem hatası: Supabase bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.');
      return;
    }

    // Supabase API çağrısı ile e-posta doğrulama
    const verifyEmail = async () => {
      try {
        console.log('Doğrulama kodu:', code);
        
        // Burada supabase null olmayacak, çünkü yukarıda kontrol ettik
        const { error } = await supabase!.auth.verifyOtp({
          token_hash: code,
          type: 'email',
        });
        
        if (error) {
          console.error('E-posta doğrulama hatası:', error);
          setStatus('error');
          setMessage('E-posta doğrulama sırasında bir hata oluştu: ' + error.message);
          return;
        }
        
        setStatus('success');
        setMessage('E-posta adresiniz başarıyla doğrulandı!');
      } catch (error) {
        console.error('Beklenmeyen hata:', error);
        setStatus('error');
        setMessage('E-posta doğrulama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    };

    verifyEmail();
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              {/* VardiNote logosu yerine renkli bir placeholder */}
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-2xl font-bold">VN</span>
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">VardiNote</h2>
          <p className="mt-2 text-sm text-gray-600">Hesabınızın E-posta Doğrulaması</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {status === 'verifying' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                <p className="text-gray-700">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">{message}</p>
                <p className="text-gray-600">Artık VardiNote uygulamasını tam olarak kullanabilirsiniz.</p>
                <button className="mt-4 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
                  Uygulamaya Git
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">Doğrulama Hatası</p>
                <p className="text-gray-600">{message}</p>
                <button className="mt-4 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
                  Yeni Doğrulama Bağlantısı Gönder
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-600">
            Yardıma mı ihtiyacınız var?{' '}
            <a href="#" className="font-medium text-primary hover:text-primary-dark">
              Destek Ekibimizle İletişime Geçin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 