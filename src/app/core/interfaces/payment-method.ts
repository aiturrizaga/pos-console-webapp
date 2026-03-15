export interface PaymentMethod {
  id: number;
  code: string;
  icon: string;
  name: string;
  methodType: string;
  requiresReference: boolean;
  active: boolean;
}

export interface PaymentItem {
  id: number;
  code: string;
  icon: string;
  name: string;
  methodType: string;
  amount: number;
}

export interface PaymentMethodFilter {
  active?: boolean;
  q?: string;
  code?: string;
  name?: string;
  methodType?: string;
  requiresReference?: boolean;
}
