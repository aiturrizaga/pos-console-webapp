import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PrintService {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/sales`;

  printPdf(path: string): void {
    this.#http.get(`${ this.baseUrl }/${ path }`, { responseType: 'blob' }).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);

      let iframe = document.getElementById('print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-frame';
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:none;visibility:hidden;';
        document.body.appendChild(iframe);
      }

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          URL.revokeObjectURL(blobUrl);
        }, 300);
      };

      iframe.src = blobUrl;
    });
  }
}
