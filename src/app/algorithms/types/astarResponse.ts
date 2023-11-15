import { NodeInterface } from 'src/app/shared/types/node.interface';

export interface AstarResponseInterface {
  closedSet: Set<NodeInterface>;
  path: NodeInterface[];
}
