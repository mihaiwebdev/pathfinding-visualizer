import { Injectable } from '@angular/core';
import { BoardService } from 'src/app/board/services/board.service';
import { NodeInterface } from '../types/node.interface';
import { NodeProperty } from '../enums/nodeProperty';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private boardService: BoardService) {}

  public getNodeNeighbours(
    currentNode: NodeInterface,
    step: number,
    nodeProperty: string
  ): NodeInterface[] {
    const { row, col } = currentNode;

    const neighbours: NodeInterface[] = [];

    const directions = [
      { newRow: row - step, newCol: col },
      { newRow: row + step, newCol: col },
      { newRow: row, newCol: col - step },
      { newRow: row, newCol: col + step },
    ];

    for (const direction of directions) {
      const { newRow, newCol } = direction;

      if (
        newRow >= 0 &&
        newRow < this.boardService.rows() &&
        newCol >= 0 &&
        newCol < this.boardService.columns()
      ) {
        const neighbourRow = this.boardService.allNodes().get(newRow);
        if (
          neighbourRow &&
          this.checkValidNeighbour(neighbourRow[newCol], nodeProperty)
        ) {
          neighbours.push(neighbourRow[newCol]);
        }
      }
    }

    return neighbours;
  }

  private checkValidNeighbour(node: NodeInterface, nodeProperty: string) {
    return nodeProperty === NodeProperty.ISMAZE
      ? !node.isMaze
      : nodeProperty === NodeProperty.ISWALL
      ? !node.isWall
      : nodeProperty === NodeProperty.ISVISITED
      ? !node.isVisited
      : false;
  }

  public getShortestPath(endNode: NodeInterface): NodeInterface[] {
    let nodes: NodeInterface[] = [];
    let currentNode: NodeInterface | null = endNode;

    while (currentNode !== null) {
      nodes.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    return nodes;
  }
}
