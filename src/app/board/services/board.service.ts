import { Injectable, computed, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { NodeInterface } from '../../shared/types/node.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  public rows = signal(0);
  public columns = signal(0);

  private startNodeRow = computed(() => Math.round(this.rows() / 5));
  private startNodeCol = computed(() => Math.round(this.columns() / 2));
  private endNodeRow = computed(() => Math.round(this.rows() / 1.2));
  private endNodeCol = computed(() => Math.round(this.columns() / 2.5));

  public startNode: NodeInterface = {} as NodeInterface;
  public endNode: NodeInterface = {} as NodeInterface;

  public allNodes = signal(new Map<number, NodeInterface[]>());

  constructor() {
    this.initGridSize();

    this.createNodes();

    this.updateBoardOnResize();
  }

  // Create rows of nodes and set the start and target node
  private createNodes(): void {
    const newNodes = new Map<number, NodeInterface[]>();

    for (let row = 0; row < this.rows(); row++) {
      const currentRow: NodeInterface[] = [];

      for (let col = 0; col < this.columns(); col++) {
        currentRow.push(this.createNode(row, col));
      }
      newNodes.set(row, currentRow);
    }

    this.allNodes.set(newNodes);

    this.setStartEndNodes();
  }

  private setStartEndNodes(): void {
    const startNodeRow = this.allNodes().get(this.startNodeRow());
    const endNodeRow = this.allNodes().get(this.endNodeRow());

    if (startNodeRow) this.startNode = startNodeRow[this.startNodeCol()];
    if (endNodeRow) this.endNode = endNodeRow[this.endNodeCol()];
  }

  private createNode(row: number, col: number): NodeInterface {
    return {
      row,
      col,
      isStart: row === this.startNodeRow() && col === this.startNodeCol(),
      isEnd: row === this.endNodeRow() && col === this.endNodeCol(),
      distance: Infinity,
      distanceToTarget: Infinity,
      totalCost: 0,
      isVisited: false,
      isVisitedDirectly: false,
      isMaze: false,
      isWall: false,
      isPath: false,
      isPathDirectly: false,
      previousNode: null,
    };
  }

  public clearBoard({ walls }: { walls: boolean }): void {
    this.allNodes.mutate((nodesMap) => {
      for (const nodes of nodesMap.values()) {
        for (const node of nodes) {
          if (walls) node.isWall = false;
          node.isVisited = false;
          node.isVisitedDirectly = false;
          node.isPath = false;
          node.isPathDirectly = false;
          node.isMaze = false;
          node.distance = Infinity;
          node.totalCost = 0;
          node.distanceToTarget = Infinity;
          node.previousNode = null;
        }
      }
    });
  }

  private initGridSize(): void {
    // Initialize grid rows and columns
    if (window.innerWidth > 1920) {
      this.rows.set(Math.round(1920 / 25 - 5));
    } else {
      this.rows.set(Math.round(window.innerWidth / 25 - 5));
    }

    if (window.innerHeight > 963) {
      this.columns.set(Math.round(963 / 25 - 10));
    } else {
      this.columns.set(Math.round(window.innerHeight / 25 - 10));
    }
  }

  private updateBoardOnResize(): void {
    // Update the grid size on screen resize
    fromEvent(window, 'resize').subscribe((event: Event) => {
      const eventTarget = event.target as Window;

      if (eventTarget.innerWidth <= 1920) {
        this.rows.set(Math.round(eventTarget.innerWidth / 25 - 5));
      }

      if (eventTarget.innerHeight < 1000) {
        this.columns.set(Math.round(eventTarget.innerHeight / 25 - 10));
      }
      this.createNodes();
    });
  }
}
