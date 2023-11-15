import { Component } from '@angular/core';
import { BoardComponent } from './board/components/board/board.component';
import { HeaderComponent } from './header/components/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [BoardComponent, HeaderComponent],
})
export class AppComponent {}
