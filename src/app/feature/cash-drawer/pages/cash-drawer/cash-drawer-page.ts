import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '@/core/services/product/product-api';
import { ProductResponse, ProductSkuResponse } from '@/core/interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

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
    InputNumberModule
  ],
  templateUrl: './cash-drawer-page.html',
  styles: ``,
})
export class CashDrawerPage implements OnInit {
  searchCtrl = new FormControl();
  #productApi = inject(ProductApi);

  searchedSkuProducts = signal<ProductSkuResponse[]>([]);
  favoriteItems = signal<ProductSkuResponse[]>([]);
  selectedSkuProducts = signal<ProductSkuResponse[]>([]);

  ngOnInit(): void {
    this.getFavoriteProducts();
  }

  search(event: AutoCompleteCompleteEvent): void {
    this.#productApi.search(event.query).subscribe(res => {
      if (!res?.data?.content) {
        this.searchedSkuProducts.set([]);
        return;
      }

      const skus = this.getSkusFromProducts(res.data.content);
      this.searchedSkuProducts.set(skus);
    });
  }

  selectSkuProductFromAutocomplete(event: AutoCompleteSelectEvent): void {
    this.selectSkuProduct(event.value)
  }

  selectSkuProduct(sku: ProductSkuResponse): void {
    this.selectedSkuProducts.update(prev => [...prev, sku]);
  }

  removeSkuProduct(sku: ProductSkuResponse): void {
    this.selectedSkuProducts.update(prev =>
      prev.filter(item => item.id !== sku.id)
    );
  }

  getFavoriteProducts(): void {
    this.#productApi.getAll().subscribe(res => {
      if (!res?.data?.content) {
        this.favoriteItems.set([]);
        return;
      }

      const skus = this.getSkusFromProducts(res.data.content);
      this.favoriteItems.set(skus);
    })
  }

  private getSkusFromProducts(products: ProductResponse[]) {
    return products.flatMap(product =>
      (product.skus ?? []).map(sku => ({
        ...sku,
        productId: product.id,
        productName: product.name
      }))
    );
  }

}
