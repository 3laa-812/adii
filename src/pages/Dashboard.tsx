import { CreditCard, Car, Plus, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useI18nStore } from '@/stores/useI18nStore';
import { t } from '@/lib/i18n';
import { Header } from '@/components/Header';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { locale } = useI18nStore();

  // Mock recent transactions
  const recentTransactions = [
    {
      id: '1',
      date: '2024-01-15T10:30:00Z',
      amount: 15.50,
      gateName: 'Cairo-Alexandria Highway - Gate 1',
      vehiclePlate: 'ABC 123',
      status: 'completed' as const,
    },
    {
      id: '2',
      date: '2024-01-14T16:45:00Z',
      amount: 12.00,
      gateName: 'Ring Road - North Exit',
      vehiclePlate: 'ABC 123',
      status: 'completed' as const,
    },
    {
      id: '3',
      date: '2024-01-13T08:15:00Z',
      amount: 8.75,
      gateName: 'New Capital Highway - Gate 3',
      vehiclePlate: 'ABC 123',
      status: 'pending' as const,
    },
  ];

  const quickTopUpAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your toll collection account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <Card className="lg:col-span-2 bg-gradient-primary text-primary-foreground shadow-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('walletBalance', locale)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    EGP {user?.balance?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-primary-foreground/80">
                    Available for toll payments
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickTopUpAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 text-primary-foreground hover:bg-white/30 border-0"
                    >
                      +EGP {amount}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="topup" className="w-full justify-start" asChild>
                <a href="/wallet">
                  <Plus className="mr-2 h-4 w-4" />
                  Top up Wallet
                </a>
              </Button>
              <Button variant="vehicle" className="w-full justify-start" asChild>
                <a href="/vehicles">
                  <Car className="mr-2 h-4 w-4" />
                  {t('addVehicle', locale)}
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/transactions">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View All Transactions
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-6 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('recentTransactions', locale)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                        <span className="font-medium">
                          {transaction.gateName}
                        </span>
                      </div>
                      <Badge
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          transaction.status === 'completed'
                            ? 'bg-success text-success-foreground'
                            : 'bg-warning text-warning-foreground'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.vehiclePlate} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <div className="font-semibold text-lg">
                      -EGP {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Start using toll roads to see your history here.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};