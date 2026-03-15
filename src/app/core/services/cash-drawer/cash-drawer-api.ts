import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { ApiResponse } from '@/core/interfaces/api-response';
import { CashDrawerUserConf } from '@/core/interfaces/cash-drawer';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CashDrawerApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/cash-drawers`;

  loadUserConfig() {
    return this.#http.get<ApiResponse<CashDrawerUserConf>>(`${ this.baseUrl }/user/me`)
      .pipe(
        tap(res => {
          localStorage.setItem('cashDrawerUserConf', JSON.stringify(res.data));
        })
      );
  }

  get userConfig(): CashDrawerUserConf {
    return JSON.parse(localStorage.getItem('cashDrawerUserConf') ?? '{}') as CashDrawerUserConf;
  }

}
