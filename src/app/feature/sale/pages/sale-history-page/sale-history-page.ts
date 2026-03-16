import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PosSessionApi } from '@/core/services/pos/pos-session-api';
import { SaleApi } from '@/core/services/sale/sale-api';
import { CashDrawerApi } from '@/core/services/cash-drawer/cash-drawer-api';
import { PosSessionResponse } from '@/core/interfaces/pos-session';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { debounceTime, filter, merge, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PosSaleDetailResponse } from '@/core/interfaces/pos-sale';

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
    TagModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './sale-history-page.html',
  styles: ``,
})
export class SaleHistoryPage implements OnInit {
  filters = signal([
    { label: 'Hoy', value: 'now' },
    { label: 'Ayer', value: 'yesterday' },
    { label: 'Últimos 7 días', value: 'l7d' },
    { label: 'Últimos 30 días', value: 'l30d' },
  ]);

  private readonly FILTER_RANGES: Record<string, () => [Date, Date]> = {
    now: () => [this.startOfDay(), this.endOfDay()],
    yesterday: () => [this.startOfDay(-1), this.endOfDay(-1)],
    l7d: () => [this.startOfDay(-6), this.endOfDay()],
    l30d: () => [this.startOfDay(-29), this.endOfDay()],
  };

  sales = signal<PosSaleDetailResponse[]>([]);
  first = 0;
  rows = 10;

  #posSessionApi = inject(PosSessionApi);
  #drawerApi = inject(CashDrawerApi);
  #saleApi = inject(SaleApi);
  readonly #destroyRef = inject(DestroyRef);

  session = signal<PosSessionResponse | null>(null);

  filterControl = new FormControl(this.filters()[0].value);
  dateRangeControl = new FormControl<Date[]>([]);

  constructor() {
    this.dateRangeControl.setValue(this.FILTER_RANGES[this.filterControl.value!]());
  }

  ngOnInit(): void {
    this.listenFilterChanges();
    this.getSaleHistory();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getSaleHistory(): void {
    const terminalId = this.#drawerApi.userConfig.terminalId;
    const [paidFrom, paidTo] = this.dateRangeControl.value ?? [];

    this.#posSessionApi.getAll({
      terminalId,
      openedFrom: paidFrom?.toISOString(),
      openedTo: paidTo?.toISOString(),
    }).pipe(
      switchMap(res => {
        const session = res?.data?.content?.[0];
        this.session.set(session ?? null);
        return this.#saleApi.getAll({
          sessionId: session?.id,
          paidFrom: paidFrom?.toISOString(),
          paidTo: paidTo?.toISOString(),
        });
      })
    ).subscribe(res => {
      this.sales.set(res?.data?.content ?? []);
    });
  }

  private listenFilterChanges(): void {
    this.filterControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(value => {
      const range = this.FILTER_RANGES[value!];
      if (range) this.dateRangeControl.setValue(range(), { emitEvent: false });
    });

    merge(
      this.filterControl.valueChanges,
      this.dateRangeControl.valueChanges.pipe(
        filter(range => !!range?.[0] && !!range?.[1])
      )
    ).pipe(
      takeUntilDestroyed(this.#destroyRef),
      debounceTime(100)
    ).subscribe(() => this.getSaleHistory());
  }

  private startOfDay(offsetDays = 0): Date {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(offsetDays = 0): Date {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
