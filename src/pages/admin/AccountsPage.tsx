import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Eye, DollarSign, Lock, Unlock, CreditCard, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserAccount {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  wallet?: {
    balance: number;
    auto_topup_enabled: boolean;
    auto_topup_threshold: number;
    auto_topup_amount: number;
  };
  vehicles?: Array<{
    id: string;
    plate_number: string;
    rfid_tag?: string;
    is_default: boolean;
  }>;
  status: 'active' | 'locked';
}

export const AccountsPage = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [newRfidTag, setNewRfidTag] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accounts, searchQuery]);

  const fetchAccounts = async () => {
    try {
      // Mock data since we can't access auth.users directly
      const mockAccounts: UserAccount[] = [
        {
          id: "1",
          email: "user1@example.com",
          created_at: "2024-01-15T10:00:00Z",
          last_sign_in_at: "2024-01-20T14:30:00Z",
          status: "active",
          wallet: {
            balance: 250.50,
            auto_topup_enabled: true,
            auto_topup_threshold: 50,
            auto_topup_amount: 100
          },
          vehicles: [
            { id: "v1", plate_number: "ABC 123", rfid_tag: "RF001", is_default: true },
            { id: "v2", plate_number: "XYZ 789", is_default: false }
          ]
        },
        {
          id: "2",
          email: "user2@example.com",
          created_at: "2024-01-10T08:00:00Z",
          status: "active",
          wallet: {
            balance: 75.25,
            auto_topup_enabled: false,
            auto_topup_threshold: 50,
            auto_topup_amount: 100
          },
          vehicles: [
            { id: "v3", plate_number: "DEF 456", rfid_tag: "RF002", is_default: true }
          ]
        },
        {
          id: "3",
          email: "user3@example.com",
          created_at: "2024-01-08T12:00:00Z",
          status: "locked",
          wallet: {
            balance: 10.00,
            auto_topup_enabled: false,
            auto_topup_threshold: 50,
            auto_topup_amount: 100
          },
          vehicles: []
        }
      ];

      setAccounts(mockAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = accounts;

    if (searchQuery) {
      filtered = filtered.filter(account => 
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.vehicles?.some(v => v.plate_number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleForceTopup = async () => {
    if (!selectedAccount || !topupAmount) return;

    const amount = parseFloat(topupAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid top-up amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock force top-up
      toast({
        title: "Success",
        description: `Forced top-up of ${amount} EGP for ${selectedAccount.email}`,
      });
      
      setTopupAmount("");
      setSelectedAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error forcing topup:", error);
      toast({
        title: "Error",
        description: "Failed to force top-up",
        variant: "destructive",
      });
    }
  };

  const handleToggleLock = async (accountId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'locked' : 'active';
      
      // Mock toggle lock
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, status: newStatus as 'active' | 'locked' } : acc
      ));

      toast({
        title: "Success",
        description: `Account ${newStatus === 'locked' ? 'locked' : 'unlocked'} successfully`,
      });
    } catch (error) {
      console.error("Error toggling lock:", error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  const handleLinkRfidTag = async (vehicleId: string) => {
    if (!newRfidTag.trim()) {
      toast({
        title: "Invalid Tag",
        description: "Please enter a valid RFID tag",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock RFID linking
      toast({
        title: "Success",
        description: `RFID tag ${newRfidTag} linked successfully`,
      });
      
      setNewRfidTag("");
      fetchAccounts();
    } catch (error) {
      console.error("Error linking RFID:", error);
      toast({
        title: "Error",
        description: "Failed to link RFID tag",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading accounts...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account Management</h1>
          <p className="text-muted-foreground">
            Search and manage user accounts, wallets, and RFID tags
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search by email or plate number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Accounts ({filteredAccounts.length})</CardTitle>
            <CardDescription>
              Manage user accounts, wallets, and vehicle tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.email}</TableCell>
                    <TableCell>
                      <Badge variant={account.status === 'active' ? 'default' : 'destructive'}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {account.wallet ? `${account.wallet.balance} EGP` : 'No Wallet'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {account.vehicles?.map(vehicle => (
                          <div key={vehicle.id} className="flex items-center gap-2 text-sm">
                            <span>{vehicle.plate_number}</span>
                            {vehicle.is_default && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                            {vehicle.rfid_tag && (
                              <Badge variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {vehicle.rfid_tag}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {account.last_sign_in_at ? 
                        new Date(account.last_sign_in_at).toLocaleString() : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Account Details</DialogTitle>
                              <DialogDescription>
                                View and manage account information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm">{account.email}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <p className="text-sm">
                                    <Badge variant={account.status === 'active' ? 'default' : 'destructive'}>
                                      {account.status}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <Label>Wallet Balance</Label>
                                  <p className="text-sm">{account.wallet?.balance} EGP</p>
                                </div>
                                <div>
                                  <Label>Auto Top-up</Label>
                                  <p className="text-sm">
                                    {account.wallet?.auto_topup_enabled ? 'Enabled' : 'Disabled'}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Vehicles</Label>
                                <div className="mt-2 space-y-2">
                                  {account.vehicles?.map(vehicle => (
                                    <div key={vehicle.id} className="flex items-center justify-between p-2 border rounded">
                                      <div>
                                        <span className="font-medium">{vehicle.plate_number}</span>
                                        {vehicle.is_default && (
                                          <Badge variant="outline" className="ml-2 text-xs">Default</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {vehicle.rfid_tag ? (
                                          <Badge variant="secondary">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {vehicle.rfid_tag}
                                          </Badge>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <Input
                                              placeholder="RFID Tag"
                                              value={newRfidTag}
                                              onChange={(e) => setNewRfidTag(e.target.value)}
                                              className="w-24 h-8"
                                            />
                                            <Button 
                                              size="sm" 
                                              onClick={() => handleLinkRfidTag(vehicle.id)}
                                            >
                                              Link
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAccount(account)}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Force Top-up</DialogTitle>
                              <DialogDescription>
                                Add funds to user's wallet manually
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Amount (EGP)</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={topupAmount}
                                  onChange={(e) => setTopupAmount(e.target.value)}
                                />
                              </div>
                              <Button onClick={handleForceTopup} className="w-full">
                                Force Top-up
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleLock(account.id, account.status)}
                        >
                          {account.status === 'active' ? 
                            <Lock className="h-4 w-4" /> : 
                            <Unlock className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};