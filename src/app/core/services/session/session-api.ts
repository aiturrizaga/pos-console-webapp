import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionDto } from '@/core/services/session/session-db';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class SessionApi {
  #http = inject(HttpClient);

  getMe(userId: string): Promise<ApiResponse<SessionDto>> {
    return firstValueFrom(this.#http.get<ApiResponse<SessionDto>>(`${ environment.api.gateway }/ms-organization/v1/users/${ userId }/me`));
  }
}
