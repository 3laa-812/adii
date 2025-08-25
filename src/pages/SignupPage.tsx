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

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  otp: z.string().min(4, 'OTP is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const { signup, isLoading } = useAuthStore();
  const { locale } = useI18nStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const phoneValue = watch('phone');

  const sendOtp = async () => {
    if (!phoneValue || phoneValue.length < 10) {
      toast({
        title: t('error', locale),
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    // Mock OTP sending
    setOtpSent(true);
    toast({
      title: t('success', locale),
      description: 'OTP sent to your phone number. Use 1234 for demo.',
    });
  };

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        password: data.password,
        otp: data.otp,
      });
      toast({
        title: t('success', locale),
        description: 'Account created successfully!',
      });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast({
        title: t('error', locale),
        description: 'Failed to create account. Please try again.',
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
              {t('signup', locale)}
            </CardTitle>
            <CardDescription>
              Create your account to start using Smart Toll Collection
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name', locale)}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="أحمد محمد / Ahmed Mohamed"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone', locale)}</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+201234567890"
                    {...register('phone')}
                    className={errors.phone ? 'border-destructive flex-1' : 'flex-1'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendOtp}
                    disabled={otpSent}
                  >
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit code"
                    {...register('otp')}
                    className={errors.otp ? 'border-destructive' : ''}
                    maxLength={4}
                  />
                  {errors.otp && (
                    <p className="text-sm text-destructive">
                      {errors.otp.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Demo: Use 1234 as OTP code
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('email', locale)} (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading || !otpSent}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading', locale)}
                  </>
                ) : (
                  t('signup', locale)
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" size="sm" className="px-0" asChild>
                  <a href="/login" className="text-primary hover:text-primary-600">
                    {t('login', locale)}
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