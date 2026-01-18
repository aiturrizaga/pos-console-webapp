import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnitMeasure, UnitMeasureGrouped } from '@/core/interfaces/unit-measure';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureApi {
  #http = inject(HttpClient);
  private readonly apiUrl = `${ environment.api.gateway }/ms-catalogue/v1/unit-measures`;

  getAll() {
    return this.#http.get<ApiResponse<UnitMeasure[]>>(this.apiUrl);
  }

  getById(id: number) {
    return this.#http.get<ApiResponse<UnitMeasure>>(`${ this.apiUrl }/${ id }`);
  }

  getGrouped() {
    return this.#http.get<ApiResponse<UnitMeasureGrouped[]>>(`${ this.apiUrl }/grouped`);
  }
}
