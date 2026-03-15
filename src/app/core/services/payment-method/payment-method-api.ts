import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';
import { PaymentMethod, PaymentMethodFilter } from '@/core/interfaces/payment-method';
import { map } from 'rxjs';

const METHOD_ICONS: Record<string, string> = {
  CASH: 'ti ti-cash',
  CARD: 'ti ti-credit-card',
  TRANSFER: 'ti ti-building-bank',
  QR: 'ti ti-qrcode',
  WALLET: 'ti ti-wallet',
  OTHER: 'ti ti-dots-circle-horizontal',
};

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/payment-methods`;

  getAll(filter: PaymentMethodFilter = { active: true }, pageable: {
    page?: number;
    size?: number;
    sort?: string
  } = {}) {
    const params = new HttpParams({ fromObject: { ...filter, ...pageable } as any });
    return this.#http
      .get<ApiResponse<Page<PaymentMethod>>>(this.baseUrl, { params })
      .pipe(
        map(res => ({
          ...res,
          data: {
            ...res.data,
            content: res.data.content.map(m => ({
              ...m,
              icon: METHOD_ICONS[m.methodType] ?? 'ti ti-cash'
            }))
          }
        }))
      );
  }
}
