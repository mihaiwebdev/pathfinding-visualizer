import { Injectable, signal } from '@angular/core';
import { DijkstraService } from 'src/app/algorithms/services/dijkstra.service';
import { NodeInterface } from 'src/app/shared/types/node.interface';
import { BoardService } from '../../board/services/board.service';
import { aStarService } from './aStar.service';

@Injectable({
  providedIn: 'root',
})
export class VisualizeAlgoSerivce {
  public speed = 1;
  public disableBtn = signal(false);

  constructor(
    private boardService: BoardService,
    private dijkstraService: DijkstraService,
    private aStarServie: aStarService
  ) {}

  public visualizeDijkstra({ animate }: { animate: boolean }): void {
    this.disableBtn.set(true);

    const { visitedNodes, path } = this.dijkstraService.dijkstra(
      this.boardService.allNodes(),
      this.boardService.startNode,
      this.boardService.endNode
    );

    this.watchAlgo(animate, visitedNodes, path);
  }

  public visualizeAstar(): void {
    this.disableBtn.set(true);

    const { closedSet, path } = this.aStarServie.aStar(
      this.boardService.startNode,
      this.boardService.endNode
    );

    this.watchAlgo(true, Array.from(closedSet), path);
  }
  // Loop through the visited nodes and update them
  // with or without animation
  private watchAlgo(
    animate: boolean,
    visitedNodes: NodeInterface[],
    path: NodeInterface[]
  ): void {
    visitedNodes.forEach((node, idx) => {
      const visitedNodeRow = this.boardService.allNodes().get(node.row);

      if (visitedNodeRow) {
        const visitedNode = visitedNodeRow[node.col];
        animate
          ? this.animateAlgo(visitedNode, idx, path, animate)
          : (visitedNode.isVisitedDirectly = true);
      }

      if (!animate && node.isEnd) {
        this.watchPath(path, animate);
      }
    });

    if (path.length < 1) this.disableBtn.set(false);
  }

  private animateAlgo(
    node: NodeInterface,
    idx: number,
    path: NodeInterface[],
    animate: boolean
  ): void {
    setTimeout(() => {
      node.isVisited = true;
      if (node.isEnd) this.watchPath(path, animate);
    }, 10 * this.speed * idx);
  }

  private watchPath(path: NodeInterface[], animate: boolean) {
    if (path.length === 0) this.disableBtn.set(false);

    for (const node of path) {
      const index = path.indexOf(node);
      const pathNodeRow = this.boardService.allNodes().get(node.row);

      if (animate) {
        setTimeout(() => {
          if (pathNodeRow) pathNodeRow[node.col].isPath = true;
          if (index === path.length - 1) this.disableBtn.set(false);
        }, 50 * this.speed * index);
      } else {
        if (pathNodeRow) pathNodeRow[node.col].isPathDirectly = true;
        if (index === path.length - 1) this.disableBtn.set(false);
      }
    }
  }
}
