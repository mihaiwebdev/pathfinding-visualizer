import { NodeInterface } from '../../shared/types/node.interface';

export interface DijkstraResponseInterface {
  visitedNodes: NodeInterface[];
  path: NodeInterface[];
}
