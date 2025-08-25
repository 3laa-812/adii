import { useI18nStore } from '@/stores/useI18nStore';
import { t } from '@/lib/i18n';
import automaticPaymentIcon from '@/assets/automatic-payment-icon.jpg';
import realTimeTrackingIcon from '@/assets/real-time-tracking-icon.jpg';
import paymentMethodsIcon from '@/assets/payment-methods-icon.jpg';

export const Features = () => {
  const { locale } = useI18nStore();

  const features = [
    {
      title: t('automaticPayment', locale),
      description: t('automaticPaymentDesc', locale),
      image: automaticPaymentIcon,
      gradient: 'from-primary to-primary-600',
    },
    {
      title: t('realTimeTracking', locale),
      description: t('realTimeTrackingDesc', locale),
      image: realTimeTrackingIcon,
      gradient: 'from-success to-success-600',
    },
    {
      title: t('multiplePaymentMethods', locale),
      description: t('multiplePaymentMethodsDesc', locale),
      image: paymentMethodsIcon,
      gradient: 'from-toll-gate to-warning-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-primary-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose Smart Toll Collection?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of highway travel with our cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-gradient-card p-8 rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent */}
              <div className="mt-6 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${feature.gradient} transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};