import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CurrencyPipe } from '@angular/common';
import { ProductSaleItem } from '@/core/interfaces/product';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaymentItem, PaymentMethod } from '@/core/interfaces/payment-method';
import { ButtonModule } from 'primeng/button';
import { PaymentMethodApi } from '@/core/services/payment-method/payment-method-api';
import { SaleApi } from '@/core/services/sale/sale-api';
import {
  CreateSaleRequest,
  PosSaleDetailResponse,
  PosSaleLineCreateRequest,
  PosSalePaymentCreateRequest
} from '@/core/interfaces/pos-sale';
import Keycloak from 'keycloak-js';
import { SaleSuccessMsg } from '@/feature/cash-drawer/components/sale-success-msg/sale-success-msg';
import { PrintService } from '@/core/services/print/print-service';

@Component({
  selector: 'app-save-cash-box-dlg',
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputTextModule,
    InputGroupAddonModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    CurrencyPipe,
    SaleSuccessMsg,
  ],
  templateUrl: './save-cash-box-dlg.html',
  styles: ``,
})
export class SaveCashBoxDlg implements OnInit, OnDestroy {
  items = signal<ProductSaleItem[]>([]);
  total = signal(0);
  sessionId = signal<number | null>(null);
  saleSuccess = signal<PosSaleDetailResponse | null>(null);

  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);

  #paymentMethodApi = inject(PaymentMethodApi);
  #saleApi = inject(SaleApi);
  #keycloak = inject(Keycloak);
  #printService = inject(PrintService);

  documentTypes = signal([
    { id: 'SALE_NOTE', name: 'Nota de venta' },
    { id: 'BOLETA', name: 'Boleta' },
    { id: 'FACTURA', name: 'Factura' },
  ]);

  paymentMethods = signal<PaymentMethod[]>([]);

  paymentItems = signal<PaymentItem[]>([]);

  paid = computed(() =>
    this.paymentItems().reduce((sum, i) => sum + i.amount, 0)
  );

  remaining = computed(() =>
    Math.max(0, this.total() - this.paid())
  );

  canSell = computed(() => this.paid() >= this.total());

  documentTypeCtrl = new FormControl(this.documentTypes()[0].id);
  totalAmountCtrl = new FormControl(0);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initDlg();
    this.getPaymentMethods();
  }

  ngOnDestroy(): void {
    if (this._dialogRef) {
      this._dialogRef.close(this.saleSuccess());
    }
  }

  addPaymentItem(method: PaymentMethod): void {
    const amount = this.totalAmountCtrl.value ?? 0;
    if (amount <= 0) return;

    this.paymentItems.update(items => [
      ...items,
      { ...method, amount }
    ]);

    this.totalAmountCtrl.setValue(this.remaining());
  }

  removePaymentItem(id: number): void {
    this.paymentItems.update(items => items.filter(i => i.id !== id));
    this.totalAmountCtrl.setValue(this.remaining());
  }

  printReceipt(): void {
    const sale = this.saleSuccess();
    if (sale) {
      this.#printService.printPdf(`${sale.id}/receipt`);
    }
  }

  createSale(): void {
    if (!this.canSell()) return;
    const sessionId = this.sessionId();
    if (!sessionId) return;

    const lines: PosSaleLineCreateRequest[] = this.items().map(item => ({
      skuId: item.sku.id,
      skuName: item.sku.name,
      qty: item.qty,
      unitPrice: item.price,
      discountAmount: 0,
      taxAmount: 0,
      lineTotal: item.price * item.qty,
      note: '',
    }));

    const payments: PosSalePaymentCreateRequest[] = this.paymentItems().map(item => ({
      paymentMethodId: item.id,
      amount: item.amount,
      currencyCode: 'PEN',
      receivedBy: this.#keycloak.profile?.email ?? 'Admin',
    }));

    const sale: CreateSaleRequest = {
      sessionId,
      currencyCode: 'PEN',
      subtotal: this.total(),
      discountTotal: 0,
      taxTotal: 0,
      total: this.total(),
      documentType: this.documentTypeCtrl.value ?? 'SALE_NOTE',
      lines,
      payments
    }

    this.#saleApi.create(sale).subscribe(res => {
      if (res && res.data) {
        this.saleSuccess.set(res.data);
        this.printReceipt();
      }
    })
  }

  private getPaymentMethods(): void {
    this.#paymentMethodApi.getAll().subscribe(res => {
      if (res && res.data && res.data.content) {
        this.paymentMethods.set(res.data.content);
      }
    });
  }

  private initDlg(): void {
    if (this.instance && this.instance.data) {
      const data = this.instance.data;
      this.items.set(data.items || []);
      this.total.set(data.totalPrice || 0);
      this.sessionId.set(data.sessionId || null);
      this.totalAmountCtrl.setValue(this.total());
    }
  }
}
