export type CreateSaleRequest = Omit<PosSaleCreateRequest, 'terminalId' | 'cashierId'>;

export interface PosSaleCreateRequest {
  sessionId: number;
  terminalId: number;
  customerId?: number;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  cashierId: string;
  note?: string;
  documentType: string;
  lines: PosSaleLineCreateRequest[];
  payments: PosSalePaymentCreateRequest[];
}

export interface PosSaleLineCreateRequest {
  skuId: number;
  skuName: string;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  note: string;
}

export interface PosSalePaymentCreateRequest {
  paymentMethodId: number;
  amount: number;
  currencyCode: string;
  reference?: string;
  receivedBy: string;
}


export interface PosSaleDetailResponse {
  id: number;
  sessionId: number;
  terminalId: number;
  saleNumber: string;
  customerId: number;
  status: string;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paidAt: Date;
  cashierId: string;
  note: string;
  documentType: string;
  documentId: number;
  lines: PosSaleLineResponse[];
  payments: PosSalePaymentResponse[];
}

export interface PosSaleLineResponse {
  id: number;
  skuId: number;
  skuName: string;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  note: string;
}

export interface PosSalePaymentResponse {
  id: number;
  paymentMethodId: number;
  paymentMethodCode: string;
  paymentMethodName: string;
  amount: number;
  currencyCode: string;
  reference: string;
  paidAt: Date;
  receivedBy: string;
}
