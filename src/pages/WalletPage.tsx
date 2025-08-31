import { useState, useEffect } from 'react';
import { CreditCard, Plus, Settings, Receipt, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSelector } from '@/components/wallet/PaymentMethodSelector';

const topupSchema = z.object({
  amount: z.number().min(5, 'Minimum topup is 5 EGP').max(5000, 'Maximum topup is 5000 EGP'),
  payment_method: z.string().min(1, 'Please select a payment method'),
});

const autoTopupSchema = z.object({
  enabled: z.boolean(),
  threshold: z.number().min(0, 'Threshold cannot be negative').max(1000, 'Maximum threshold is 1000 EGP'),
  amount: z.number().min(5, 'Minimum amount is 5 EGP').max(2000, 'Maximum amount is 2000 EGP'),
});

type TopupFormData = z.infer<typeof topupSchema>;
type AutoTopupFormData = z.infer<typeof autoTopupSchema>;

interface Wallet {
  id: string;
  balance: number;
  auto_topup_enabled: boolean;
  auto_topup_threshold: number;
  auto_topup_amount: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  payment_method?: string;
  status: string;
  created_at: string;
  processed_at?: string;
}

export const WalletPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTopupDialogOpen, setIsTopupDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const topupForm = useForm<TopupFormData>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: 50,
      payment_method: '',
    },
  });

  const autoTopupForm = useForm<AutoTopupFormData>({
    resolver: zodResolver(autoTopupSchema),
    defaultValues: {
      enabled: false,
      threshold: 50,
      amount: 100,
    },
  });

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet information',
        variant: 'destructive',
      });
    } else {
      setWallet(data);
      autoTopupForm.reset({
        enabled: data.auto_topup_enabled,
        threshold: Number(data.auto_topup_threshold),
        amount: Number(data.auto_topup_amount),
      });
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } else {
      setTransactions(data || []);
    }
  };

  const quickTopupAmounts = [5, 10, 20, 50];

  const handleQuickTopup = (amount: number) => {
    topupForm.setValue('amount', amount);
    setIsTopupDialogOpen(true);
  };

  const onTopupSubmit = async (data: TopupFormData) => {
    if (!user || !wallet) return;

    setIsProcessing(true);
    try {
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          type: 'topup',
          amount: data.amount,
          description: `Wallet topup via ${data.payment_method}`,
          payment_method: data.payment_method,
          status: 'pending',
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update wallet balance
      const newBalance = wallet.balance + data.amount;
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (walletError) throw walletError;

      // Mark transaction as completed
      await supabase
        .from('transactions')
        .update({ 
          status: 'completed', 
          processed_at: new Date().toISOString() 
        })
        .eq('id', transaction.id);

      toast({
        title: 'Success',
        description: `Successfully added ${data.amount} EGP to your wallet`,
      });

      setIsTopupDialogOpen(false);
      topupForm.reset();
      fetchWallet();
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process topup',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onAutoTopupSubmit = async (data: AutoTopupFormData) => {
    if (!user || !wallet) return;

    try {
      const { error } = await supabase
        .from('wallets')
        .update({
          auto_topup_enabled: data.enabled,
          auto_topup_threshold: data.threshold,
          auto_topup_amount: data.amount,
        })
        .eq('id', wallet.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Auto-topup settings updated successfully',
      });

      setIsSettingsDialogOpen(false);
      fetchWallet();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'topup':
        return <ArrowDownRight className="h-4 w-4 text-success" />;
      case 'toll_payment':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-info" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              My Wallet
            </h1>
            <p className="text-muted-foreground">
              Manage your balance and payment methods
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <Card className="lg:col-span-2 bg-gradient-primary text-primary-foreground shadow-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Wallet Balance
                </div>
                <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Auto-Topup Settings</DialogTitle>
                    </DialogHeader>
                    
                    <Form {...autoTopupForm}>
                      <form onSubmit={autoTopupForm.handleSubmit(onAutoTopupSubmit)} className="space-y-4">
                        <FormField
                          control={autoTopupForm.control}
                          name="enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Enable Auto-Topup</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Automatically add funds when balance is low
                                </p>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {autoTopupForm.watch('enabled') && (
                          <>
                            <FormField
                              control={autoTopupForm.control}
                              name="threshold"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Threshold Amount (EGP)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="50"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground">
                                    Trigger auto-topup when balance falls below this amount
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={autoTopupForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Topup Amount (EGP)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="100"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground">
                                    Amount to add when auto-topup is triggered
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSettingsDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1">
                            Save Settings
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    EGP {wallet?.balance?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-primary-foreground/80 mb-4">
                    Available for toll payments
                  </p>
                  {wallet?.auto_topup_enabled && (
                    <Badge variant="secondary" className="bg-white/20 text-primary-foreground">
                      Auto-topup: {wallet.auto_topup_amount} EGP at {wallet.auto_topup_threshold} EGP
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickTopupAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuickTopup(amount)}
                      className="bg-white/20 text-primary-foreground hover:bg-white/30 border-0"
                    >
                      +{amount} EGP
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
              <Dialog open={isTopupDialogOpen} onOpenChange={setIsTopupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="topup" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Custom Topup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Funds to Wallet</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...topupForm}>
                    <form onSubmit={topupForm.handleSubmit(onTopupSubmit)} className="space-y-4">
                      <FormField
                        control={topupForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (EGP)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="5"
                                max="5000"
                                placeholder="50"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Minimum: 5 EGP • Maximum: 5000 EGP
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={topupForm.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <PaymentMethodSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsTopupDialogOpen(false)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing} className="flex-1">
                          {isProcessing ? 'Processing...' : 'Add Funds'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/dashboard">
                  <Receipt className="mr-2 h-4 w-4" />
                  View Dashboard
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transactions History */}
        <Card className="mt-6 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction)}
                        <span className="font-medium">
                          {transaction.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge
                          variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'failed' ? 'destructive' :
                            'secondary'
                          }
                          className={
                            transaction.status === 'completed'
                              ? 'bg-success text-success-foreground'
                              : transaction.status === 'failed'
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-warning text-warning-foreground'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.payment_method && `${transaction.payment_method} • `}
                      {new Date(transaction.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <div className={`font-semibold text-lg ${
                      transaction.type === 'topup' || transaction.type === 'refund' 
                        ? 'text-success' 
                        : 'text-destructive'
                    }`}>
                      {transaction.type === 'topup' || transaction.type === 'refund' ? '+' : '-'}
                      EGP {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Add funds to your wallet to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};