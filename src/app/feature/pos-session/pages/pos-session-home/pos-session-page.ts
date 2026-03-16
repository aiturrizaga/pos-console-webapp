import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import {
  OpeningCashRegisterDlg
} from '../../components/opening-cash-register-dlg/opening-cash-register-dlg';
import { ConfirmationService } from 'primeng/api';
import { PosSessionApi } from '@/core/services/pos/pos-session-api';
import { finalize } from 'rxjs';
import { PosSessionResponse } from '@/core/interfaces/pos-session';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pos-session-home-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DatePipe,
    CurrencyPipe
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './pos-session-page.html',
  styles: ``,
})
export class PosSessionPage implements OnInit {
  #dialogService = inject(DialogService);
  #confirmationService = inject(ConfirmationService);
  #posSessionApi = inject(PosSessionApi);

  loading = signal(false);
  posSession = signal<PosSessionResponse | null>(null);

  ngOnInit(): void {
    this.validateSession();
  }

  openOpeningCashRegisterDlg(): void {
    const ref = this.#dialogService.open(OpeningCashRegisterDlg, {
      header: 'Apertura de caja',
      modal: true,
      closable: true,
      closeOnEscape: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });

    ref?.onClose.subscribe(res => {
      if (res) {
        this.validateSession();
      }
    })
  }

  confirmCloseCashRegister(session: PosSessionResponse): void {
    this.#confirmationService.confirm({
      header: '¿Estas seguro de que quieres cerrar caja?',
      message: 'Al cerrar la caja no podrás hacer más modificaciones del monto contado en esta caja, ni en tus reporte de turno.',
      icon: 'ti ti-alert-square-rounded',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si, cerrar caja',
        severity: 'danger',
      },

      accept: () => {
        this.closeSession(session.id);
      }
    });
  }

  private closeSession(sessionId: number): void {
    const countedTotalAmount = this.posSession()?.totalSale ?? 0;
    this.#posSessionApi.close(sessionId, countedTotalAmount).subscribe(res => {
      if (res && res.data) {
        this.validateSession();
      }
    });
  }

  private validateSession(): void {
    this.loading.set(true);
    this.#posSessionApi.current()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: res => {
          if (res && res.data) {
            this.posSession.set(res.data);
          }
        },
        error: () => {
          this.posSession.set(null);
        }
      });
  }
}
