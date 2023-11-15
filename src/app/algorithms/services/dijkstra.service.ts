import { Injectable } from '@angular/core';
import { DijkstraResponseInterface } from '../types/dijkstraResponse';
import { NodeProperty } from '../../shared/enums/nodeProperty';
import { NodeInterface } from '../../shared/types/node.interface';
import { UtilsService } from '../../shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class DijkstraService {
  constructor(private utilsService: UtilsService) {}
  // Loop through the nodes, take the closest one,
  // mark it as visited, get it's unvisited neighbours
  // change their distance and chain them to the current node
  public dijkstra(
    allNodes: Map<number, NodeInterface[]>,
    startNode: NodeInterface,
    endNode: NodeInterface
  ): DijkstraResponseInterface {
    //
    const allNodesCopy = new Map(allNodes);
    const visitedNodes: NodeInterface[] = [];

    const unvisitedNodes: Set<NodeInterface> = this.getUnvisitedNodes(
      allNodesCopy,
      startNode
    );

    while (unvisitedNodes.size > 0) {
      let closestNode = this.getClosestUnvisitedNode(unvisitedNodes);

      if (closestNode === null) break;
      if (closestNode.isWall) continue;

      closestNode = { ...closestNode, isVisited: true };
      visitedNodes.push(closestNode);

      // If we reached the end node get the path
      if (this.isEndNode(closestNode, endNode))
        return {
          visitedNodes,
          path: this.utilsService.getShortestPath(
            visitedNodes[visitedNodes.length - 1]
          ),
        };

      this.updateUnvisitedNeighbours(closestNode, unvisitedNodes);
    }

    return { visitedNodes, path: [] };
  }

  // Create a set of the nodes
  private getUnvisitedNodes(
    allNodes: Map<number, NodeInterface[]>,
    startNode: NodeInterface
  ): Set<NodeInterface> {
    const unvisitedNodes = new Set<NodeInterface>([]);

    allNodes.forEach((rows) => {
      rows.forEach((node) => {
        if (node === startNode) {
          node = { ...node, distance: 0 };
        }
        unvisitedNodes.add(node);
      });
    });

    return unvisitedNodes;
  }

  // Get the closest node and remove it from the set
  private getClosestUnvisitedNode(unvisitedNodes: Set<NodeInterface>) {
    let closestNode: NodeInterface | null = null;
    let closestDistance = Infinity;

    for (const node of unvisitedNodes) {
      if (node.distance < closestDistance) {
        closestNode = node;
        closestDistance = node.distance;
      }
    }

    if (closestNode) unvisitedNodes.delete(closestNode);

    return closestNode;
  }

  private isEndNode(
    closestNode: NodeInterface,
    endNode: NodeInterface
  ): boolean {
    return closestNode.col === endNode.col && closestNode.row === endNode.row;
  }

  // Chain the unvisited neighbours of a node to it
  // and update their distance
  private updateUnvisitedNeighbours(
    closestNode: NodeInterface,
    unvisitedNodes: Set<NodeInterface>
  ): void {
    const unvisitedNeighbours = this.utilsService.getNodeNeighbours(
      closestNode,
      1,
      NodeProperty.ISVISITED
    );

    for (const neighbour of unvisitedNeighbours) {
      const node = Array.from(unvisitedNodes).find(
        (node) => node === neighbour
      );
      if (node) {
        const updatedNode = {
          ...node,
          distance: closestNode.distance + 1,
          previousNode: closestNode,
        };

        unvisitedNodes.delete(node);
        unvisitedNodes.add(updatedNode);
      }
    }
  }
}
