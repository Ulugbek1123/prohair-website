import React, { useState } from 'react';
import { X, CheckCircle, Shield, Award, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Button } from './ui/button';

interface AssociationRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssociationRegistrationModal({ isOpen, onClose }: AssociationRegistrationModalProps) {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('trichologist');
  const [city, setCity] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim() === '+998') {
      setErrorMsg(t('Пожалуйста, заполните имя и телефон', 'Iltimos, ism va telefon raqamingizni kiriting', 'Please fill in your name and phone'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/association-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          specialty,
          city,
          workplace,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || t('Ошибка при отправке заявки. Попробуйте еще раз.', 'Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'Submission error. Please try again.'));
      }
    } catch {
      setErrorMsg(t('Сетевая ошибка. Пожалуйста, проверьте подключение.', 'Tarmoq xatosi. Internet aloqasini tekshiring.', 'Network error. Please check connection.'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFullName('');
    setPhone('+998 ');
    setEmail('');
    setCity('');
    setWorkplace('');
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8">
        <button
          onClick={handleReset}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={t('Закрыть', 'Yopish', 'Close')}
        >
          <X className="size-5" />
        </button>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto size-16 text-accent mb-4" />
            <h3 className="font-serif text-3xl font-bold text-foreground">
              {t('Заявка успешно принята!', 'Arizangiz muvaffaqiyatli qabul qilindi!', 'Application received!')}
            </h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t(
                'Благодарим за интерес к O‘zSTTA. Наш представитель свяжется с вами в ближайшее время для подтверждения данных и вступления в ассоциацию.',
                'O‘zSTTA assotsiatsiyasiga qiziqishingiz uchun tashakkur. Mutaxassisimiz tez orada siz bilan bog‘lanib, a’zolik ma’lumotlarini tasdiqlaydi.',
                'Thank you for your application to O‘zSTTA. Our representative will contact you shortly.'
              )}
            </p>
            <div className="mt-8">
              <Button onClick={handleReset} className="h-11 px-8 rounded-xl">
                {t('Понятно', 'Tushunarli', 'Got it')}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
              <Shield className="size-4" />
              <span>O‘zSTTA · {t('Членство в ассоциации', 'Assotsiatsiyaga a’zolik', 'Association Membership')}</span>
            </div>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {t('Вступить в Ассоциацию', 'Assotsiatsiyaga a’zo bo‘lish', 'Join the Association')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t(
                'Заполните форму, чтобы стать частью профессионального сообщества трихологов Узбекистана, получать скидки на обучение и доступ к закрытым клиническим разборам.',
                'O‘zbekiston trixologlari professional hamjamiyatiga qo‘shilish, ta’lim dasturlarida imtiyozlar va yopiq klinik tahlillarga kirish uchun arizani to‘ldiring.',
                'Join the community of trichologists in Uzbekistan, access exclusive clinical cases, and enjoy member benefits.'
              )}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-border text-center text-xs">
              <div className="p-2 rounded-lg bg-muted/40">
                <Award className="mx-auto size-4 text-accent mb-1" />
                <span className="font-semibold text-foreground">{t('Сертификат', 'Sertifikat', 'Certificate')}</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <BookOpen className="mx-auto size-4 text-accent mb-1" />
                <span className="font-semibold text-foreground">{t('Клинические разборы', 'Klinik tahlillar', 'Clinical cases')}</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <Users className="mx-auto size-4 text-accent mb-1" />
                <span className="font-semibold text-foreground">{t('Нетворкинг', 'Netvorking', 'Networking')}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {t('Ф.И.О.', 'F.I.Sh.', 'Full Name')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('Например: Каримов Анвар Рустамович', 'Masalan: Karimov Anvar Rustamovich', 'e.g. Anvar Karimov')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t('Телефон', 'Telefon raqam', 'Phone')} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t('Email', 'Email', 'Email')}
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t('Специальность', 'Mutaxassislik', 'Specialty')}
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  >
                    <option value="trichologist">{t('Трихолог', 'Trixolog', 'Trichologist')}</option>
                    <option value="dermatologist">{t('Дерматовенеролог', 'Dermatovenerolog', 'Dermatovenerologist')}</option>
                    <option value="cosmetologist">{t('Врач-косметолог', 'Shifokor-kosmetolog', 'Cosmetologist')}</option>
                    <option value="surgeon">{t('Трансплантолог волос / Хирург', 'Soch transplantologi / Jarroh', 'Hair restoration surgeon')}</option>
                    <option value="clinic_head">{t('Руководитель клиники', 'Klinika rahbari', 'Clinic Director')}</option>
                    <option value="other">{t('Другое', 'Boshqa mutaxassislik', 'Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t('Город / Регион', 'Shahar / Viloyat', 'City / Region')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Ташкент, Самарканд...', 'Toshkent, Samarqand...', 'Tashkent...')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {t('Место работы / Клиника', 'Ish joyi / Klinika', 'Workplace / Clinic')}
                </label>
                <input
                  type="text"
                  placeholder={t('Название клиники или медцентра', 'Klinika yoki tibbiyot markazi nomi', 'Clinic name')}
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {t('Комментарий или вопрос (необязательно)', 'Qo‘shimcha izoh yoki savol (ixtiyoriy)', 'Comment (optional)')}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('Ваши пожелания или вопросы...', 'Istaklaringiz yoki savollaringiz...', 'Any comments...')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-md text-base"
                >
                  {loading
                    ? t('Отправка...', 'Yuborilmoqda...', 'Submitting...')
                    : t('Подать заявку на членство', 'A’zolik arizasini topshirish', 'Submit Application')}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {t(
                    'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.',
                    'Tugmani bosish orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirasiz.',
                    'By submitting you agree to the processing of personal data.'
                  )}
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
