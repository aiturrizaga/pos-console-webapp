import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCreateRequest, ProductResponse, ProductUpdateRequest } from '@/core/interfaces/product';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-catalogue/v1/products`;

  create(req: ProductCreateRequest) {
    return this.#http.post<ApiResponse<ProductResponse>>(this.baseUrl, req);
  }

  getById(id: number) {
    return this.#http.get<ApiResponse<ProductResponse>>(`${ this.baseUrl }/${ id }`);
  }

  getAll(opts?: { page?: number; size?: number; sort?: string | string[]; }) {
    let params = new HttpParams();

    if (opts?.page != null) params = params.set('page', String(opts.page));
    if (opts?.size != null) params = params.set('size', String(opts.size));

    const sort = opts?.sort;
    if (typeof sort === 'string') {
      params = params.append('sort', sort);
    } else if (Array.isArray(sort)) {
      sort.forEach(s => (params = params.append('sort', s)));
    }

    return this.#http.get<ApiResponse<Page<ProductResponse>>>(this.baseUrl, { params });
  }

  update(id: number, req: ProductUpdateRequest) {
    return this.#http.put<ApiResponse<ProductResponse>>(`${ this.baseUrl }/${ id }`, req);
  }

  deactivate(id: number) {
    return this.#http.delete<void>(`${ this.baseUrl }/${ id }`);
  }

}
