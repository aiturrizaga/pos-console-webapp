export interface PosSessionResponse {
  id: number;
  terminalId: number;
  drawerId: number;
  openedBy: string;
  openedAt: Date;
  closedBy: string;
  closedAt: Date;
  status: string;
  openingNote: string;
  closingNote: string;
  expectedTotalAmount: number;
  countedTotalAmount: number;
  diffTotalAmount: number;
  totalSale: number;
  transactionQty: number;
}

export type PosSessionOpenRequest = Pick<PosSessionResponse, 'terminalId' | 'drawerId' | 'openedBy' | 'expectedTotalAmount' | 'openingNote'>;

export type PosSessionCloseRequest = Pick<PosSessionResponse, 'id' | 'closedBy' | 'countedTotalAmount' | 'closingNote'>;


export interface PosSessionFilter {
  terminalId?: number;
  drawerId?: number;
  status?: string;
  openedBy?: string;
  openedFrom?: string;
  openedTo?: string;
}
