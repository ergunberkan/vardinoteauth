# VardiNote Kimlik Doğrulama Sayfaları

Bu proje, VardiNote uygulaması için e-posta doğrulama ve şifre sıfırlama sayfalarını içermektedir. Sayfalar modern ve sade bir tasarıma sahiptir ve Supabase kimlik doğrulama işlemleri için tasarlanmıştır.

## Özellikler

- **E-posta Doğrulama Sayfası**: Kullanıcılar kayıt olduktan sonra e-posta adreslerini doğrulamak için bu sayfayı kullanır.
- **Şifre Sıfırlama Sayfası**: Kullanıcılar şifrelerini unuttukları zaman yeni şifre belirlemek için bu sayfayı kullanır.

## Teknolojiler

- Next.js
- TypeScript
- TailwindCSS
- React Hooks

## Kurulum

Projeyi yerel olarak kurmak ve çalıştırmak için:

1. Repoyu klonlayın
   ```
   git clone <repo-url>
   ```

2. Proje dizinine gidin
   ```
   cd vardinoteauth
   ```

3. Bağımlılıkları yükleyin
   ```
   npm install
   ```

4. Geliştirme sunucusunu başlatın
   ```
   npm run dev
   ```

## Kullanım

Bu sayfalar Supabase'in e-posta doğrulama ve şifre sıfırlama işlemleri ile çalışmak üzere tasarlanmıştır. Sayfaları Vercel'e dağıtarak, aşağıdaki URL'leri Supabase'in yönlendirme URL'leri olarak ayarlayabilirsiniz:

- E-posta Doğrulama: `https://[your-domain]/auth/confirm-email`
- Şifre Sıfırlama: `https://[your-domain]/auth/reset-password`

## Vercel'e Dağıtma

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Fvardinoteauth)

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
