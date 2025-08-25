import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18nStore } from '@/stores/useI18nStore';
import { t } from '@/lib/i18n';
import tollHeroImage from '@/assets/toll-hero.jpg';

export const Hero = () => {
  const { locale } = useI18nStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${tollHeroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-scale-in">
            <div className="w-2 h-2 bg-success rounded-full animate-toll-pulse" />
            Smart Technology • Real-time Processing
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            {t('heroTitle', locale)}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
            {t('heroSubtitle', locale)}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up [animation-delay:400ms]">
            <Button variant="hero" size="xl" className="group" asChild>
              <a href="/signup">
                {t('getStarted', locale)}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform rtl-flip" />
              </a>
            </Button>
            <Button variant="outline" size="xl" className="group" asChild>
              <a href="#features">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t('learnMore', locale)}
              </a>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up [animation-delay:600ms]">
          <div className="bg-gradient-card p-6 rounded-xl shadow-card backdrop-blur-sm">
            <div className="text-2xl font-bold text-primary mb-2">500K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl shadow-card backdrop-blur-sm">
            <div className="text-2xl font-bold text-success mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl shadow-card backdrop-blur-sm">
            <div className="text-2xl font-bold text-toll-gate mb-2">150+</div>
            <div className="text-muted-foreground">Toll Gates</div>
          </div>
        </div>
      </div>
    </section>
  );
};