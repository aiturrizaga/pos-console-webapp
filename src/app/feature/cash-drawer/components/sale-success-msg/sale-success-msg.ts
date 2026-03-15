import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sale-success-msg',
  imports: [
    FormsModule,
    ButtonModule
  ],
  templateUrl: './sale-success-msg.html',
  styles: ``,
})
export class SaleSuccessMsg {
  print  = output<void>();
  sendEmail = output<string>();

  email = '';

  onSendEmail(): void {
    if (!this.email) return;
    this.sendEmail.emit(this.email);
    this.email = '';
  }
}
