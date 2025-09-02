import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertTriangle, CheckCircle, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';

interface ReconciliationFile {
  id: string;
  filename: string;
  provider: string;
  upload_date: string;
  status: string;
  transaction_count?: number | null;
  total_amount?: number | null;
  discrepancies_count: number | null;
  discrepancies: any;
  processed_at?: string | null;
  processed_by?: string | null;
  file_url: string;
  created_at: string;
}

interface Discrepancy {
  type: 'missing_transaction' | 'amount_mismatch' | 'duplicate' | 'unknown_transaction';
  transaction_id?: string;
  provider_ref?: string;
  our_amount?: number;
  provider_amount?: number;
  description: string;
}

export const FinancePage = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<ReconciliationFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ReconciliationFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDrop: handleFileUpload
  });

  useEffect(() => {
    fetchReconciliationFiles();
  }, []);

  const fetchReconciliationFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("reconciliation_files")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching reconciliation files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reconciliation files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  async function handleFileUpload(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock file processing
      const fileContent = await file.text();
      const mockFileData = {
        filename: file.name,
        provider: detectProvider(file.name),
        upload_date: new Date().toISOString(),
        status: 'processing' as const,
        transaction_count: 150,
        total_amount: 7500.50,
        discrepancies_count: 0,
        discrepancies: [] as any,
        file_url: 'mock-url'
      };

      const { data, error } = await supabase
        .from("reconciliation_files")
        .insert([mockFileData])
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(100);
      
      // Simulate processing
      setTimeout(async () => {
        await processReconciliationFile(data.id);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

      toast({
        title: "Upload Successful",
        description: "File uploaded and processing started",
      });

      fetchReconciliationFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload reconciliation file",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const detectProvider = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('vodafone')) return 'Vodafone Cash';
    if (lower.includes('instapay')) return 'InstaPay';
    if (lower.includes('bank')) return 'Bank Transfer';
    return 'Unknown';
  };

  const processReconciliationFile = async (fileId: string) => {
    try {
      // Mock reconciliation processing
      const mockDiscrepancies: Discrepancy[] = [
        {
          type: 'amount_mismatch',
          transaction_id: 'TXN-001',
          provider_ref: 'REF-123',
          our_amount: 25.00,
          provider_amount: 24.50,
          description: 'Amount difference of 0.50 EGP'
        },
        {
          type: 'missing_transaction',
          provider_ref: 'REF-456',
          provider_amount: 15.00,
          description: 'Transaction found in provider file but missing in our records'
        }
      ];

      const { error } = await supabase
        .from("reconciliation_files")
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          discrepancies_count: mockDiscrepancies.length,
          discrepancies: mockDiscrepancies as any
        })
        .eq("id", fileId);

      if (error) throw error;

      fetchReconciliationFiles();

      toast({
        title: "Processing Complete",
        description: `Found ${mockDiscrepancies.length} discrepancies`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      
      await supabase
        .from("reconciliation_files")
        .update({ status: 'failed' })
        .eq("id", fileId);

      toast({
        title: "Processing Failed",
        description: "Failed to process reconciliation file",
        variant: "destructive",
      });
    }
  };

  const handleSettle = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from("reconciliation_files")
        .update({
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq("id", fileId);

      if (error) throw error;

      toast({
        title: "Settlement Complete",
        description: "Reconciliation has been settled",
      });

      fetchReconciliationFiles();
    } catch (error) {
      console.error("Error settling:", error);
      toast({
        title: "Settlement Failed",
        description: "Failed to settle reconciliation",
        variant: "destructive",
      });
    }
  };

  const downloadDiscrepancyReport = (file: ReconciliationFile) => {
    const reportContent = [
      ["Type", "Transaction ID", "Provider Ref", "Our Amount", "Provider Amount", "Description"],
      ...file.discrepancies.map((d: Discrepancy) => [
        d.type,
        d.transaction_id || '',
        d.provider_ref || '',
        d.our_amount || '',
        d.provider_amount || '',
        d.description
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([reportContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `discrepancy-report-${file.filename}.csv`;
    a.click();

    toast({
      title: "Report Downloaded",
      description: "Discrepancy report downloaded successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "outline",
      failed: "destructive"
    } as const;

    const icons = {
      pending: <FileText className="h-3 w-3 mr-1" />,
      processing: <Upload className="h-3 w-3 mr-1" />,
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
      failed: <AlertTriangle className="h-3 w-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reconciliation files...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Financial Reconciliation</h1>
          <p className="text-muted-foreground">
            Upload provider files and reconcile transactions with discrepancy reporting
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Reconciliation File
            </CardTitle>
            <CardDescription>
              Upload CSV/JSON files from payment providers for reconciliation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <div>
                  <p>Drag & drop a reconciliation file here, or click to select</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports CSV, JSON, XLS, XLSX files
                  </p>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Uploading and processing...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reconciliation Files */}
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Files ({files.length})</CardTitle>
            <CardDescription>
              Track uploaded files and reconciliation status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Discrepancies</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.filename}</TableCell>
                    <TableCell>{file.provider}</TableCell>
                    <TableCell>{new Date(file.upload_date).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell>{file.transaction_count || '-'}</TableCell>
                    <TableCell>
                      {file.total_amount ? `${file.total_amount} EGP` : '-'}
                    </TableCell>
                    <TableCell>
                      {file.discrepancies_count > 0 ? (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {file.discrepancies_count}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          None
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedFile(file)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Reconciliation Details</DialogTitle>
                              <DialogDescription>
                                View transaction differences and discrepancies
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFile && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <Label>Provider</Label>
                                    <p className="text-sm">{selectedFile.provider}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">{getStatusBadge(selectedFile.status)}</p>
                                  </div>
                                  <div>
                                    <Label>Transactions</Label>
                                    <p className="text-sm">{selectedFile.transaction_count}</p>
                                  </div>
                                  <div>
                                    <Label>Total Amount</Label>
                                    <p className="text-sm">{selectedFile.total_amount} EGP</p>
                                  </div>
                                </div>

                                {selectedFile.discrepancies.length > 0 && (
                                  <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <Label>Discrepancies ({selectedFile.discrepancies.length})</Label>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => downloadDiscrepancyReport(selectedFile)}
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report
                                      </Button>
                                    </div>
                                    <div className="border rounded-lg">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Transaction ID</TableHead>
                                            <TableHead>Provider Ref</TableHead>
                                            <TableHead>Our Amount</TableHead>
                                            <TableHead>Provider Amount</TableHead>
                                            <TableHead>Description</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedFile.discrepancies.map((disc: Discrepancy, index) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                <Badge variant="outline">
                                                  {disc.type.replace('_', ' ')}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>{disc.transaction_id || '-'}</TableCell>
                                              <TableCell>{disc.provider_ref || '-'}</TableCell>
                                              <TableCell>{disc.our_amount || '-'}</TableCell>
                                              <TableCell>{disc.provider_amount || '-'}</TableCell>
                                              <TableCell>{disc.description}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                )}

                                {selectedFile.status === 'completed' && selectedFile.discrepancies_count === 0 && (
                                  <div className="flex items-center justify-center p-8 text-center">
                                    <div>
                                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                      <h3 className="text-lg font-medium">Reconciliation Complete</h3>
                                      <p className="text-muted-foreground">All transactions match perfectly</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {file.discrepancies_count > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadDiscrepancyReport(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}

                        {file.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSettle(file.id)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
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