import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';
import {
  CreateCompanyRequest,
  CreatePartnerRequest,
  CreatePersonRequest,
  PartnerResponse,
  UpdatePartnerRequest
} from '@/core/interfaces/partner';

@Injectable({
  providedIn: 'root',
})
export class CustomerApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-organization/v1/partners`;

  create(req: CreatePartnerRequest) {
    return this.#http.post<ApiResponse<PartnerResponse>>(this.baseUrl, req);
  }

  createPerson(req: CreatePersonRequest) {
    return this.#http.post<ApiResponse<PartnerResponse>>(this.baseUrl, req);
  }

  createCompany(req: CreateCompanyRequest) {
    return this.#http.post<ApiResponse<PartnerResponse>>(this.baseUrl, req);
  }

  getById(partnerId: number) {
    return this.#http.get<ApiResponse<PartnerResponse>>(`${ this.baseUrl }/${ partnerId }`);
  }

  getAll(opts?: { isActive?: boolean; page?: number; size?: number; sort?: string | string[] }) {
    let params = new HttpParams();

    if (opts?.isActive != null) params = params.set('isActive', String(opts.isActive));
    if (opts?.page != null) params = params.set('page', String(opts.page));
    if (opts?.size != null) params = params.set('size', String(opts.size));

    const sort = opts?.sort;
    if (typeof sort === 'string') {
      params = params.append('sort', sort);
    } else if (Array.isArray(sort)) {
      sort.forEach(s => (params = params.append('sort', s)));
    }

    return this.#http.get<ApiResponse<Page<PartnerResponse>>>(this.baseUrl, { params });
  }

  update(partnerId: number, req: UpdatePartnerRequest) {
    return this.#http.put<ApiResponse<PartnerResponse>>(`${ this.baseUrl }/${ partnerId }`, req);
  }

  deactivate(partnerId: number) {
    return this.#http.delete<ApiResponse<void>>(`${ this.baseUrl }/${ partnerId }`);
  }

}
