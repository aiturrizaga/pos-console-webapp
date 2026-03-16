import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '@/core/services/product/product-api';
import { ProductResponse, ProductSaleItem, ProductSkuResponse } from '@/core/interfaces/product';
import { CurrencyPipe, NgClass } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { PosSessionResponse } from '@/core/interfaces/pos-session';
import { PosSessionApi } from '@/core/services/pos/pos-session-api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  OpeningCashRegisterDlg
} from '@/feature/pos-session/components/opening-cash-register-dlg/opening-cash-register-dlg';
import { SaveCashBoxDlg } from '@/feature/cash-drawer/components/save-cash-box-dlg/save-cash-box-dlg';

@Component({
  selector: 'app-cash-drawer-page',
  imports: [
    CardModule,
    ButtonModule,
    ChipModule,
    FloatLabelModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    CurrencyPipe,
    InputNumberModule,
    InputTextModule,
    FormsModule,
    NgClass
  ],
  providers: [DialogService],
  templateUrl: './cash-drawer-page.html',
  styles: ``,
})
export class CashDrawerPage implements OnInit {
  searchCtrl = new FormControl();
  #productApi = inject(ProductApi);
  #posSessionApi = inject(PosSessionApi);
  #dialogService = inject(DialogService);
  loading = signal(false);
  posSession = signal<PosSessionResponse | null>(null);

  searchedProducts = signal<ProductResponse[]>([]);
  favoriteItems = signal<ProductResponse[]>([]);
  selectedProducts = signal<ProductSaleItem[]>([]);
  searchMode = signal<'favorite' | 'product' | 'category'>('favorite');

  totalPrice = computed(() => {
    return this.selectedProducts().reduce((sum, item) => {
      const price = item.sku.price;

      return sum + (price || 0) * (item.qty ?? 1);
    }, 0);
  });

  ngOnInit(): void {
    this.validateSession();
    this.getFavoriteProducts();
  }

  search(event: AutoCompleteCompleteEvent): void {
    this.#productApi.getAll({ q: event.query, active: true }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.searchedProducts.set(res.data.content);
      }
    });
  }

  selectSkuProductFromAutocomplete(event: AutoCompleteSelectEvent): void {
    this.selectProduct(event.value);
  }

  selectProduct(product: ProductResponse): void {
    const item: ProductSaleItem = {...product, qty: 1};
    this.selectedProducts.update(prev => [...prev, item]);
  }

  removeProductAt(index: number): void {
    this.selectedProducts.update(prev => prev.filter((_, i) => i !== index));
  }

  getFavoriteProducts(): void {
    this.#productApi.getAll({ active: true }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.favoriteItems.set(res.data.content);
      }
    })
  }

  openCashBoxDlg(): void {
    const ref = this.#dialogService.open(SaveCashBoxDlg, {
      header: 'Caja registradora',
      modal: true,
      draggable: false,
      closable: true,
      closeOnEscape: true,
      width: '80vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        items: this.selectedProducts(),
        totalPrice: this.totalPrice(),
        sessionId: this.posSession()?.id,
      }
    });

    ref?.onClose.subscribe(res => {
      if (res) {
        this.selectedProducts.set([]);
      }
    })
  }

  private validateSession(): void {
    this.loading.set(true);
    this.#posSessionApi.current()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: res => {
          if (res && res.data) {
            this.posSession.set(res.data);
          }
        },
        error: () => {
          this.posSession.set(null);
        }
      });
  }

}
