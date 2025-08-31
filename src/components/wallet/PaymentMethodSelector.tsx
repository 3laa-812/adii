import { useState } from 'react';
import { CreditCard, Smartphone, Building, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  requiresInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'vodafone_cash',
    name: 'Vodafone Cash',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Pay using your Vodafone Cash wallet',
    requiresInput: true,
    inputLabel: 'Mobile Number',
    inputPlaceholder: '01xxxxxxxxx',
  },
  {
    id: 'instapay',
    name: 'InstaPay',
    icon: <QrCode className="h-5 w-5" />,
    description: 'Instant bank transfer via InstaPay',
    requiresInput: true,
    inputLabel: 'Mobile Number',
    inputPlaceholder: '01xxxxxxxxx',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, Mastercard, or local bank cards',
    requiresInput: false,
  },
];

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    paymentMethods.find(method => method.id === value) || null
  );
  const [inputValue, setInputValue] = useState('');

  const handleMethodSelect = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    setSelectedMethod(method || null);
    
    if (!method?.requiresInput) {
      onChange(methodId);
    } else {
      setInputValue('');
      // Don't call onChange yet, wait for input
      if (methodId === value) {
        // If same method is selected, keep the current value
      } else {
        onChange(''); // Clear value until input is provided
      }
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (selectedMethod && newValue.trim()) {
      onChange(`${selectedMethod.id}:${newValue}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedMethod?.id || ''}
        onValueChange={handleMethodSelect}
      >
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <Label
                htmlFor={method.id}
                className="cursor-pointer"
              >
                <Card className={`transition-colors hover:bg-accent ${
                  selectedMethod?.id === method.id ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-2 rounded-full bg-accent">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Label>

              {selectedMethod?.id === method.id && method.requiresInput && (
                <div className="mt-3 ml-8 space-y-2">
                  <Label htmlFor={`${method.id}-input`} className="text-sm">
                    {method.inputLabel}
                  </Label>
                  <Input
                    id={`${method.id}-input`}
                    type={method.id === 'card' ? 'text' : 'tel'}
                    placeholder={method.inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </RadioGroup>

      {selectedMethod?.id === 'card' && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4" />
            <span className="font-medium text-sm">Secure Payment</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your card details will be processed securely. We don't store your card information.
          </p>
        </div>
      )}

      {(selectedMethod?.id === 'vodafone_cash' || selectedMethod?.id === 'instapay') && inputValue && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4" />
            <span className="font-medium text-sm">Payment Confirmation</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You will receive a payment request on {inputValue}. Please approve it to complete the transaction.
          </p>
        </div>
      )}
    </div>
  );
};
