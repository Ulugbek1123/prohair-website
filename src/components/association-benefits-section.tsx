import { ShieldCheck, Award, BookOpen, Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Button } from './ui/button';

interface AssociationBenefitsSectionProps {
  onJoinClick: () => void;
}

export function AssociationBenefitsSection({ onJoinClick }: AssociationBenefitsSectionProps) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Award,
      title: t('Официальный сертификат члена', 'Rasmiy a’zolik sertifikati', 'Official Member Certificate'),
      desc: t(
        'Подтверждение профессионального статуса и признание ведущей ассоциацией трихологов страны.',
        'Mamlakatning yetakchi trixologiya assotsiatsiyasi tomonidan kasbiy maqomni tasdiqlash.',
        'Proof of your clinical standing recognized by the national trichology body.'
      ),
    },
    {
      icon: BookOpen,
      title: t('Закрытые клинические разборы', 'Yopiq klinik tahlillar', 'Exclusive Case Reviews'),
      desc: t(
        'Ежемесячные онлайн и очные разборы сложных случаев алопеций с международными экспертами.',
        'Xalqaro ekspertlar bilan birgalikda alopetsiyaning og‘ir holatlari bo‘yicha oylik amaliy tahlillar.',
        'Monthly reviews of complex alopecia cases with international experts.'
      ),
    },
    {
      icon: ShieldCheck,
      title: t('Клинические протоколы и стандарты', 'Klinik protokollar va standartlar', 'Clinical Protocols & Standards'),
      desc: t(
        'Доступ к современной доказательной базе, методическим рекомендациям и алгоритмам ведения пациентов.',
        'Zamonaviy isbotlangan tibbiyot bazasi, uslubiy tavsiyalar va bemorlarni davolash algoritmlari.',
        'Evidence-based clinical guidelines, patient workflows, and diagnostic algorithms.'
      ),
    },
    {
      icon: Sparkles,
      title: t('Льготы на конгрессы и курсы', 'Kongress va kurslarda imtiyozlar', 'Congress & Course Discounts'),
      desc: t(
        'Специальные условия и скидки на участие в PROHAIR Congress, мастер-классах и сертификационных курсах.',
        'PROHAIR kongresslari, amaliy master-klasslar va sertifikatlash kurslarida maxsus chegirmalar.',
        'Preferred rates and early access to PROHAIR Congresses and hands-on masterclasses.'
      ),
    },
    {
      icon: Users,
      title: t('Реестр проверенных специалистов', 'Tekshirilgan mutaxassislar reestri', 'Directory of Verified Specialists'),
      desc: t(
        'Размещение профиля врача или клиники в официальном каталоге для повышения доверия пациентов.',
        'Bemorlar ishonchini oshirish uchun rasmiy shifokorlar va klinikalar katalogiga kiritilish.',
        'Listing in the official practitioner directory to help prospective patients find you.'
      ),
    },
    {
      icon: CheckCircle2,
      title: t('Профессиональное сообщество', 'Professional hamjamiyat', 'Professional Community'),
      desc: t(
        'Обмен опытом с коллегами, участие в научных инициативах и поддержка в сложных клинических вопросах.',
        'Hamkasblar bilan doimiy tajriba almashish, ilmiy tashabbuslar va murakkab masalalarda o‘zaro yordam.',
        'Networking with peers, participating in research initiatives, and clinical support.'
      ),
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="section-kicker">O‘zSTTA MEMBERSHIP</p>
          <h2 className="section-title mt-2">
            {t('Преимущества членства в Ассоциации', 'Assotsiatsiyaga a’zo bo‘lish afzalliklari', 'Benefits of Association Membership')}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t(
              'O‘zSTTA объединяет передовых врачей-трихологов, дерматологов и специалистов индустрии для совместного роста и внедрения мировых стандартов.',
              'O‘zSTTA ilg‘or trixologlar, dermatologlar va soha mutaxassislarini birgalikda o‘sish va jahon standartlarini joriy etish uchun birlashtiradi.',
              'O‘zSTTA connects trichologists, dermatologists, and industry leaders to foster growth and elevate clinical excellence.'
            )}
          </p>
        </div>

        <Button
          onClick={onJoinClick}
          className="h-12 rounded-xl bg-accent px-6 text-accent-foreground font-bold shadow-lg hover:bg-accent/90 shrink-0"
        >
          {t('Подать заявку на вступление', 'A’zolik arizasini topshirish', 'Apply for Membership')}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-accent/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-r from-primary/90 via-primary to-primary/80 p-8 sm:p-10 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="max-w-2xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            {t('Готовы развивать трихологию вместе с нами?', 'Trixologiyani biz bilan birga rivojlantirishga tayyormisiz?', 'Ready to advance trichology with us?')}
          </h3>
          <p className="mt-2 text-sm text-primary-foreground/85 leading-relaxed">
            {t(
              'Присоединяйтесь к O‘zSTTA сегодня. Регистрация занимает всего пару минут.',
              'Bugunoq O‘zSTTA a’zosiga aylaning. Ariza topshirish atigi bir necha daqiqa vaqtingizni oladi.',
              'Join O‘zSTTA today. The application takes just a couple of minutes.'
            )}
          </p>
        </div>
        <Button
          onClick={onJoinClick}
          className="h-12 rounded-xl bg-accent px-8 text-accent-foreground font-bold hover:bg-accent/90 shadow-lg shrink-0"
        >
          {t('Стать членом Ассоциации', 'Assotsiatsiyaga a’zo bo‘lish', 'Join the Association')}
        </Button>
      </div>
    </section>
  );
}
