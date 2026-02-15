import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import {
  OpeningCashRegisterDlg
} from '../../components/opening-cash-register-dlg/opening-cash-register-dlg';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-pos-session-home-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './pos-session-page.html',
  styles: ``,
})
export class PosSessionPage {
  #dialogService = inject(DialogService);
  #confirmationService = inject(ConfirmationService);

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
      }
    })
  }

  confirmCloseCashRegister(): void {
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
        console.log('Confirm target');
      }
    });
  }
}
