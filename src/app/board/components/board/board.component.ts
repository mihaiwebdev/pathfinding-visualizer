import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.styles.scss'],
  standalone: true,
  imports: [CommonModule, NodeComponent],
})
export class BoardComponent {
  constructor(public boardService: BoardService) {}
}
