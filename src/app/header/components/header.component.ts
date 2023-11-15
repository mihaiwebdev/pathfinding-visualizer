import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VisualizeAlgoSerivce } from 'src/app/algorithms/services/visualizeAlgo.service';
import { BoardService } from 'src/app/board/services/board.service';
import { Algo } from 'src/app/shared/enums/algo';
import { RandomizedMazeService } from '../../algorithms/services/randomizedMaze.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.styles.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class HeaderComponent {
  public selectAlgoSpeed: null | number = null;
  public selectedAlgo: null | string = null;
  public algoEnum = Algo;

  constructor(
    private boardService: BoardService,
    private randomizedMazeService: RandomizedMazeService,
    public visualizeAlgoService: VisualizeAlgoSerivce
  ) {}

  public findPath(): void {
    this.boardService.clearBoard({ walls: false });

    if (this.selectedAlgo === this.algoEnum.DIJKSTRA)
      this.visualizeAlgoService.visualizeDijkstra({ animate: true });

    if (this.selectedAlgo === this.algoEnum.ASTAR)
      this.visualizeAlgoService.visualizeAstar();
  }

  public clearBoard(): void {
    this.boardService.clearBoard({ walls: true });
  }

  public changeSpeed(): void {
    if (this.selectAlgoSpeed)
      this.visualizeAlgoService.speed = this.selectAlgoSpeed;
  }

  public createMaze(): void {
    this.boardService.clearBoard({ walls: true });

    this.randomizedMazeService.randomizedDepthFirst(this.boardService.allNodes);
  }
}
