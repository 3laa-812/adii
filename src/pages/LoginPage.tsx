import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useI18nStore } from '@/stores/useI18nStore';
import { t } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';

const loginSchema = z.object({
  phoneOrEmail: z.string().min(1, 'Phone or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const { locale } = useI18nStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      toast({
        title: t('success', locale),
        description: 'Successfully logged in!',
      });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast({
        title: t('error', locale),
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="shadow-soft">
          <CardHeader className="space-y-1 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-primary p-3 rounded-xl">
                <Car className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold">
              {t('login', locale)}
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneOrEmail">
                  {t('email', locale)} / {t('phone', locale)}
                </Label>
                <Input
                  id="phoneOrEmail"
                  type="text"
                  placeholder="ahmed@example.com or +201234567890"
                  {...register('phoneOrEmail')}
                  className={errors.phoneOrEmail ? 'border-destructive' : ''}
                />
                {errors.phoneOrEmail && (
                  <p className="text-sm text-destructive">
                    {errors.phoneOrEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password', locale)}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button variant="link" size="sm" className="px-0" asChild>
                  <a href="/forgot-password">
                    {t('forgotPassword', locale)}
                  </a>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading', locale)}
                  </>
                ) : (
                  t('login', locale)
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" size="sm" className="px-0" asChild>
                  <a href="/signup" className="text-primary hover:text-primary-600">
                    {t('signup', locale)}
                  </a>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};