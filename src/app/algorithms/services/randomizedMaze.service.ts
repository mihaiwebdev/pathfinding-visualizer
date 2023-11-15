import { Injectable, WritableSignal } from '@angular/core';
import { NodeInterface } from 'src/app/shared/types/node.interface';
import { Stack } from '../../shared/classes/stack';
import { NodeProperty } from '../../shared/enums/nodeProperty';
import { UtilsService } from '../../shared/services/utils.service';
import { VisualizeAlgoSerivce } from './visualizeAlgo.service';

@Injectable({
  providedIn: 'root',
})
export class RandomizedMazeService {
  // 1. Choose the start node, mark it as visited and push it to the stack
  // 2. While the stack is not empty
  //  2.1 Pop a node from the stack and make it the current node
  //  2.2 If the current node has any neighbour which have not been visited
  //   2.2.1 Push the current node to the stack
  //   2.2.2 Choose one of the unvisited neighbours
  //   2.2.3 Remove the wall for the current and chosen nodes and between them
  //   2.2.4 Mark the chosen node as visited and push it to the stack

  constructor(
    private visualizeAlgoService: VisualizeAlgoSerivce,
    private utilsService: UtilsService
  ) {}

  private mazeStack = new Stack<NodeInterface>();

  public async randomizedDepthFirst(
    allNodes: WritableSignal<Map<number, NodeInterface[]>>
  ): Promise<void> {
    this.visualizeAlgoService.disableBtn.set(true);
    this.createWalls(allNodes);

    const initialNodeRow = allNodes().get(1);
    if (!initialNodeRow) return;

    const initialNode = initialNodeRow[1];

    initialNode.isWall = false;
    initialNode.isMaze = true;

    this.mazeStack.push(initialNode);

    while (!this.mazeStack.isEmpty()) {
      const currentNode = this.mazeStack.pop();
      if (!currentNode) return;

      const neighbours: NodeInterface[] = this.utilsService.getNodeNeighbours(
        currentNode,
        2,
        NodeProperty.ISMAZE
      );

      if (neighbours.length > 0) {
        this.mazeStack.push(currentNode);

        const randomIndex = Math.floor(Math.random() * neighbours.length);
        const randomNeighbour: NodeInterface = neighbours[randomIndex];

        const wallBetween = this.getWallBetweenNodes(
          allNodes(),
          currentNode,
          randomNeighbour
        );

        if (wallBetween) {
          await this.delay(15);
          wallBetween.isWall = false;
          wallBetween.isMaze = true;
        }

        randomNeighbour.isWall = false;
        randomNeighbour.isMaze = true;

        this.mazeStack.push(randomNeighbour);
      }
    }
    this.visualizeAlgoService.disableBtn.set(false);
  }

  private createWalls(allNodes: WritableSignal<Map<number, NodeInterface[]>>) {
    allNodes.mutate((rows) => {
      rows.forEach((row) =>
        row.forEach((node) => {
          if (!node.isStart && !node.isEnd) {
            node.isWall = true;
          }
        })
      );
    });
  }

  private getWallBetweenNodes(
    allNodes: Map<number, NodeInterface[]>,
    currentNode: NodeInterface,
    randomNeighbour: NodeInterface
  ): NodeInterface | null {
    const dx = randomNeighbour.col - currentNode.col;
    const dy = randomNeighbour.row - currentNode.row;

    if (Math.abs(dx) === 2 && dy === 0) {
      const wallBetweenRow = allNodes.get(currentNode.row);
      const wallBetweenCol =
        dx > 0 ? currentNode.col + dx - 1 : currentNode.col + dx + 1;
      return wallBetweenRow ? wallBetweenRow[wallBetweenCol] : null;
    }

    if (Math.abs(dy) === 2 && dx === 0) {
      const wallBetweenCol =
        dy > 0 ? currentNode.row + dy - 1 : currentNode.row + dy + 1;
      const wallBetweenRow = allNodes.get(wallBetweenCol);

      return wallBetweenRow ? wallBetweenRow[currentNode.col] : null;
    }

    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
