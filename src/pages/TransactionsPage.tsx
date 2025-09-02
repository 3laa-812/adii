import { useState, useEffect } from 'react';
import { Receipt, Search, Download, Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  payment_method?: string;
  status: string;
  created_at: string;
  processed_at?: string;
  transaction_ref?: string;
  metadata?: any;
}

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const itemsPerPage = 20;

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, currentPage, typeFilter, statusFilter, searchTerm]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,transaction_ref.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setTransactions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csv = [
        ['Date', 'Type', 'Description', 'Amount', 'Status', 'Payment Method', 'Reference'].join(','),
        ...data.map(t => [
          format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss'),
          t.type,
          `"${t.description}"`,
          t.amount,
          t.status,
          t.payment_method || '',
          t.transaction_ref || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();

      toast({
        title: 'Export Complete',
        description: 'Transaction history downloaded successfully',
      });
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export transaction history',
        variant: 'destructive',
      });
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'topup':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'toll_payment':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-blue-600" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary', 
      failed: 'destructive',
      cancelled: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      topup: 'Top-up',
      toll_payment: 'Toll Payment',
      refund: 'Refund',
      fee: 'Fee'
    } as const;

    const variants = {
      topup: 'outline',
      toll_payment: 'secondary',
      refund: 'default',
      fee: 'destructive'
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {getTransactionIcon({ type } as Transaction)}
        <span className="ml-1">{typeLabels[type as keyof typeof typeLabels] || type}</span>
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Transaction History
            </h1>
            <p className="text-muted-foreground">
              View and manage your complete transaction history
            </p>
          </div>
          <Button onClick={exportTransactions} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="topup">Top-up</SelectItem>
                    <SelectItem value="toll_payment">Toll Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className="w-full"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions ({totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading transactions...</div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters to see more results'
                    : 'Your transactions will appear here once you start using the service'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-muted-foreground">
                                {format(new Date(transaction.created_at), 'HH:mm')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(transaction.type)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`font-medium ${
                              transaction.type === 'toll_payment' || transaction.type === 'fee'
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}>
                              {transaction.type === 'toll_payment' || transaction.type === 'fee' ? '-' : '+'}
                              {transaction.amount.toFixed(2)} EGP
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTransaction(transaction)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Transaction Details</DialogTitle>
                                </DialogHeader>
                                {selectedTransaction && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Transaction ID</Label>
                                        <p className="text-sm text-muted-foreground font-mono">
                                          {selectedTransaction.id.slice(0, 8)}...
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Reference</Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedTransaction.transaction_ref || 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Type</Label>
                                        <div className="mt-1">
                                          {getTypeBadge(selectedTransaction.type)}
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <div className="mt-1">
                                          {getStatusBadge(selectedTransaction.status)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Amount</Label>
                                      <p className={`text-lg font-medium ${
                                        selectedTransaction.type === 'toll_payment' || selectedTransaction.type === 'fee'
                                          ? 'text-red-600'
                                          : 'text-green-600'
                                      }`}>
                                        {selectedTransaction.type === 'toll_payment' || selectedTransaction.type === 'fee' ? '-' : '+'}
                                        {selectedTransaction.amount.toFixed(2)} EGP
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Description</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedTransaction.description}
                                      </p>
                                    </div>
                                    
                                    {selectedTransaction.payment_method && (
                                      <div>
                                        <Label className="text-sm font-medium">Payment Method</Label>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedTransaction.payment_method}
                                        </p>
                                      </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Created</Label>
                                        <p className="text-sm text-muted-foreground">
                                          {format(new Date(selectedTransaction.created_at), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                      </div>
                                      {selectedTransaction.processed_at && (
                                        <div>
                                          <Label className="text-sm font-medium">Processed</Label>
                                          <p className="text-sm text-muted-foreground">
                                            {format(new Date(selectedTransaction.processed_at), 'MMM dd, yyyy HH:mm')}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} transactions
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};