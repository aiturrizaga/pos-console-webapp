import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { PosSessionApi } from '@/core/services/pos/pos-session-api';

@Component({
  selector: 'app-opening-cash-register-dlg',
  imports: [
    ReactiveFormsModule,
    MessageModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './opening-cash-register-dlg.html',
  styles: ``,
})
export class OpeningCashRegisterDlg implements OnInit, OnDestroy {
  form!: FormGroup;
  formValidator!: FormValidator;

  #fb = inject(FormBuilder);
  #posSessionApi = inject(PosSessionApi);
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);

  ngOnInit(): void {
    this.initForm();
  }

  openCashRegister(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.#posSessionApi.open(this.form.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  close(data?: any): void {
    this._dialogRef.close(data);
  }

  ngOnDestroy(): void {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

  private initForm(): void {
    this.form = this.#fb.group({
      amountPEN: [0, [Validators.required, Validators.min(0)]],
      amountUSD: [0, [Validators.required, Validators.min(0)]],
    });

    this.formValidator = new FormValidator(this.form);
  }

}
