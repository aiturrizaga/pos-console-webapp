import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';
import {
  PosSessionCloseRequest,
  PosSessionFilter,
  PosSessionOpenRequest,
  PosSessionResponse
} from '@/core/interfaces/pos-session';
import { CashDrawerApi } from '@/core/services/cash-drawer/cash-drawer-api';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class PosSessionApi {
  #http = inject(HttpClient);
  #cashDrawerApi = inject(CashDrawerApi);
  #keycloak = inject(Keycloak);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/sessions`;

  open(data: {amountPEN : number}) {
    const drawerUserConf = this.#cashDrawerApi.userConfig;
    const request: PosSessionOpenRequest = {
      terminalId: drawerUserConf.terminalId,
      drawerId: drawerUserConf.drawerId,
      expectedTotalAmount: data.amountPEN,
      openedBy: this.#keycloak.profile?.email ?? 'Admin',
      openingNote: ''
    }
    return this.#http.post<ApiResponse<PosSessionResponse>>(`${ this.baseUrl }/open`, request);
  }

  close(sessionId: number) {
    const request: PosSessionCloseRequest = {
      id: sessionId,
      closedBy: this.#keycloak.profile?.email ?? 'Admin',
      closingNote: '',
      countedTotalAmount: 0
    }
    return this.#http.post<ApiResponse<PosSessionResponse>>(`${ this.baseUrl }/close`, request);
  }

  current() {
    const drawerUserConf = this.#cashDrawerApi.userConfig;
    return this.#http.get<ApiResponse<PosSessionResponse>>(`${ this.baseUrl }/current/${ drawerUserConf.terminalId }`);
  }

  getAll(filter: PosSessionFilter = {}, pageable: { page?: number; size?: number; sort?: string } = {}) {
    const params = new HttpParams({ fromObject: { ...filter, ...pageable } as any });
    return this.#http.get<ApiResponse<Page<PosSessionResponse>>>(this.baseUrl, { params });
  }

}
