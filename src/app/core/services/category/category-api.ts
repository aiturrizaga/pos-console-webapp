import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/core/interfaces/category';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  #http = inject(HttpClient);

  getAll() {
    return this.#http.get<ApiResponse<Page<Category>>>(`${environment.api.gateway}/ms-catalogue/v1/categories`);
  }

  create(req: CategoryCreateRequest) {
    return this.#http.post<ApiResponse<Category>>(`${environment.api.gateway}/ms-catalogue/v1/categories`, req);
  }

  update(categoryId: string, req: CategoryUpdateRequest) {
    return this.#http.put<ApiResponse<Category>>(`${environment.api.gateway}/ms-catalogue/v1/categories/${categoryId}`, req);
  }

  inactive(categoryId: string) {
    return this.#http.delete<ApiResponse<void>>(`${environment.api.gateway}/ms-catalogue/v1/categories/${categoryId}`);
  }

}
