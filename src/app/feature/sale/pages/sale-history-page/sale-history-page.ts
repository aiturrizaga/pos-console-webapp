import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sale-history-page',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    AutoCompleteModule,
    CardModule,
    TableModule,
    TagModule
  ],
  templateUrl: './sale-history-page.html',
  styles: ``,
})
export class SaleHistoryPage {
  filters = signal([
    { label: 'Hoy', value: 'now' },
    { label: 'Ayer', value: 'yesterday' },
    { label: 'Últimos 7 días', value: 'l7d' },
    { label: 'Últimos 30 días', value: 'l30d' },
  ]);
  sales = signal<any[]>([]);
  first = 0;
  rows = 10;

  filterControl = new FormControl(this.filters()[0].value);
  dateRangeControl = new FormControl([new Date(), new Date()]);

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }
}
