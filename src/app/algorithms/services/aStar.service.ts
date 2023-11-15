import { Injectable } from '@angular/core';
import { NodeInterface } from 'src/app/shared/types/node.interface';
import { NodeProperty } from '../../shared/enums/nodeProperty';
import { UtilsService } from '../../shared/services/utils.service';
import { AstarResponseInterface } from '../types/astarResponse';

@Injectable({
  providedIn: 'root',
})
export class aStarService {
  constructor(private utilsService: UtilsService) {}

  public aStar(
    startNode: NodeInterface,
    endNode: NodeInterface
  ): AstarResponseInterface {
    const openSet = new Set<NodeInterface>();
    const closedSet = new Set<NodeInterface>();

    startNode.distance = 0;
    openSet.add(startNode);

    while (openSet.size > 0) {
      // Get the node with the lowest total cost value from the open set
      let currentNode = this.getNodeWithLowestTotalCost(openSet);

      // Move the current node from open to closed set
      openSet.delete(currentNode);
      closedSet.add(currentNode);

      // Check if the destination is reached
      if (currentNode === endNode) {
        return {
          closedSet,
          path: this.utilsService.getShortestPath(currentNode),
        };
      }

      // Get unvisited walkable neighbours
      const neighbours = this.utilsService
        .getNodeNeighbours(currentNode, 1, NodeProperty.ISWALL)
        .filter((node) => !closedSet.has(node));

      // Update neighbour information and add it to the open set if needed
      for (const neighbour of neighbours) {
        if (!openSet.has(neighbour)) {
          this.updateNeighbourInfo(currentNode, neighbour, endNode);
          openSet.add(neighbour);
        }
      }
    }

    // No path found
    return { closedSet: new Set<NodeInterface>(), path: [] };
  }

  // Find the node with the lowest total cost in the open set.
  private getNodeWithLowestTotalCost(openSet: Set<NodeInterface>) {
    const currentNode = [...openSet].reduce((minNode, node) => {
      return node.totalCost < minNode.totalCost ? node : minNode;
    });

    return currentNode;
  }

  // Update information for a neighbor node and add it to the open set if needed.
  private updateNeighbourInfo(
    currentNode: NodeInterface,
    neighbour: NodeInterface,
    endNode: NodeInterface
  ): void {
    neighbour.distance = currentNode.distance + 1;
    neighbour.distanceToTarget = this.heuristic(neighbour, endNode);
    neighbour.totalCost = neighbour.distance + neighbour.distanceToTarget;
    neighbour.previousNode = currentNode;
  }

  // Calculate the estimated distance from the current node to the end node
  private heuristic(node: NodeInterface, endNode: NodeInterface): number {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
  }
}
