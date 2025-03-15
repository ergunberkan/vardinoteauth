'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// Sayfayı client-side olarak işaretle
export const dynamic = 'force-dynamic';

// Ana component
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPassword />
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
          <p className="mt-2 text-sm text-gray-600">Şifre Sıfırlama</p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-gray-600">Sayfa yükleniyor...</p>
      </div>
    </div>
  );
}

// Şifre sıfırlama mantığı için ana component
function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    // Token'ın sadece varlığını kontrol ediyoruz
    // Gerçek doğrulama şifre sıfırlama sırasında olacak
    setTokenValid(true);
  }, [token]);

  // Şifre geçerliliğini kontrol etme
  useEffect(() => {
    if (password.length === 0) {
      setIsValid(true);
      setErrorMessage('');
      return;
    }

    if (password.length < 8) {
      setIsValid(false);
      setErrorMessage('Şifre en az 8 karakter uzunluğunda olmalıdır.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setIsValid(false);
      setErrorMessage('Şifreler eşleşmiyor.');
      return;
    }

    setIsValid(true);
    setErrorMessage('');
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || !token) {
      return;
    }

    // Supabase'in tanımlı olup olmadığını kontrol et
    if (!supabase) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Supabase ile şifre sıfırlama
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Şifre güncelleme hatası:', error);
        setStatus('error');
        return;
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      setStatus('error');
    }
  };

  // Geçersiz veya eksik token durumu
  if (tokenValid === false) {
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
            <p className="mt-2 text-sm text-gray-600">Şifre Sıfırlama</p>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Geçersiz veya Süresi Dolmuş Bağlantı</p>
            <p className="text-gray-600">Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebinde bulunun.</p>
            <button className="mt-4 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
              Şifremi Unuttum
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Token doğrulama durumu
  if (tokenValid === null) {
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
            <p className="mt-2 text-sm text-gray-600">Şifre Sıfırlama</p>
          </div>

          <div className="flex justify-center mt-8">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600">Bağlantı doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  // Başarılı şifre sıfırlama durumu
  if (status === 'success') {
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
            <p className="mt-2 text-sm text-gray-600">Şifre Sıfırlama</p>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Şifreniz Başarıyla Güncellendi!</p>
            <p className="text-gray-600">Yeni şifrenizle giriş yapabilirsiniz.</p>
            <button className="mt-4 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ana şifre sıfırlama formu
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
          <p className="mt-2 text-sm text-gray-600">Yeni Şifre Belirleyin</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Yeni Şifre
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="En az 8 karakter"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Şifreyi Onaylayın
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>
          </div>

          {!isValid && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Şifre güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={!isValid || status === 'loading'}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                !isValid || status === 'loading'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              ) : null}
              Şifreyi Güncelle
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
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