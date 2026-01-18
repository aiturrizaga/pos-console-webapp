import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styles: `
    .sticky-header {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  `,
})
export class Header {
}
