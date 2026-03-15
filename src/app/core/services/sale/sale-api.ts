import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CashDrawerApi } from '@/core/services/cash-drawer/cash-drawer-api';
import Keycloak from 'keycloak-js';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@/core/interfaces/api-response';
import { CreateSaleRequest, PosSaleCreateRequest, PosSaleDetailResponse } from '@/core/interfaces/pos-sale';

@Injectable({
  providedIn: 'root',
})
export class SaleApi {
  #http = inject(HttpClient);
  #cashDrawerApi = inject(CashDrawerApi);
  #keycloak = inject(Keycloak);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/sales`;

  create(req: CreateSaleRequest) {
    const drawerUserConf = this.#cashDrawerApi.userConfig;
    const userId = this.#keycloak.profile?.id ?? '';
    const request: PosSaleCreateRequest = {
      ...req,
      cashierId: userId,
      terminalId: drawerUserConf.terminalId
    }
    return this.#http.post<ApiResponse<PosSaleDetailResponse>>(this.baseUrl, request);
  }
}
