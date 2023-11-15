import { Injectable, WritableSignal, signal } from '@angular/core';
import { BoardService } from 'src/app/board/services/board.service';
import { NodeInterface } from '../../shared/types/node.interface';
import { VisualizeAlgoSerivce } from 'src/app/algorithms/services/visualizeAlgo.service';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private oldNode = {} as NodeInterface;
  private newNode = {} as NodeInterface;
  private drawWall = false;
  private isStartOrEndNode = false;
  private nodeKey: WritableSignal<'isStart' | 'isEnd'> = signal('isStart');

  constructor(
    private boardService: BoardService,
    private visualizeAlgoService: VisualizeAlgoSerivce
  ) {}

  dragStart(domEl: HTMLElement): void {
    const [node, row, col] = domEl.id.split('-');

    const oldNodeRow = this.boardService.allNodes().get(+row);
    if (oldNodeRow) this.oldNode = oldNodeRow[+col];

    if (this.oldNode.isStart || this.oldNode.isEnd) {
      this.drawWall = false;
      this.isStartOrEndNode = true;

      if (this.oldNode.isStart) this.nodeKey.set('isStart');
      if (this.oldNode.isEnd) this.nodeKey.set('isEnd');
    } else {
      this.drawWall = true;
      this.isStartOrEndNode = false;
    }
  }

  dragEnter(domEl: HTMLElement): void {
    if (this.isStartOrEndNode) {
      domEl.classList.add('drag-enter');
    }
    if (this.drawWall) {
      this.createGridWall(domEl);
    }
  }

  dragDrop(domEl: HTMLElement): void {
    const [node, row, col] = domEl.id.split('-');

    if (this.isStartOrEndNode) {
      domEl.classList.remove('drag-enter');

      const newNodeRow = this.boardService.allNodes().get(+row);
      if (newNodeRow) this.newNode = newNodeRow[+col];

      if (this.oldNode !== this.newNode && !this.newNode.isWall) {
        this.updateNodes();
      }
    }
  }

  // Change the start or end nodes and watch the shortest dijkstra path
  updateNodes(): void {
    this.boardService.clearBoard({ walls: false });

    const isStart = this.nodeKey() === 'isStart';
    const isEnd = this.nodeKey() === 'isEnd';

    this.newNode[isStart ? 'isStart' : 'isEnd'] = true;
    this.oldNode[isStart ? 'isStart' : 'isEnd'] = false;

    if (isStart) this.boardService.startNode = this.newNode;
    if (isEnd) this.boardService.endNode = this.newNode;

    this.visualizeAlgoService.visualizeDijkstra({ animate: false });
  }

  createGridWall(domEl: HTMLElement): void {
    const [nodeStr, row, col] = domEl.id.split('-');

    const nodeRow = this.boardService.allNodes().get(+row);
    if (!nodeRow) return;

    const node = nodeRow[+col];
    if (!node.isStart && !node.isEnd && !node.isPath && !node.isPathDirectly) {
      node.isWall = true;
    }
  }
}
